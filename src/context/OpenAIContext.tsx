import React, { createContext, useContext, useState } from 'react';
import type { OpenAIState, OpenAIContextType } from '../types/openai';
import type { ResearchPhase } from '../types/research';
import { verifyApiKey } from '../utils/openai';
import { getResearchPrompt } from '../utils/research';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';
import { createOpenAIClient, handleOpenAIRequest } from '../utils/openai-client';
import { getErrorMessage } from '../utils/error-handlers';
import { initialState } from './initialState';

const OpenAIContext = createContext<OpenAIContextType | undefined>(undefined);

export function OpenAIProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OpenAIState>(initialState);

  const connect = async (apiKey: string) => {
    try {
      const assistants = await verifyApiKey(apiKey);
      setState(prev => ({
        ...prev,
        apiKey,
        assistants,
        isConnected: true,
      }));
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setState(initialState);
  };

  const selectAssistant = (assistant: Assistant) => {
    setState(prev => ({
      ...prev,
      selectedAssistant: assistant,
    }));
  };

  const goBack = () => {
    setState(prev => ({
      ...prev,
      showChat: false,
      messages: [],
      threadId: null,
    }));
  };

  const proceedToChat = async () => {
    if (!state.selectedAssistant || !state.apiKey) {
      throw new Error('No assistant selected or API key missing');
    }

    try {
      const openai = createOpenAIClient(state.apiKey);
      const thread = await handleOpenAIRequest(
        () => openai.beta.threads.create(),
        'creating chat thread'
      );
      
      setState(prev => ({
        ...prev,
        showChat: true,
        threadId: thread.id,
      }));
    } catch (error) {
      console.error('Failed to create thread:', error);
      throw error;
    }
  };

  const startResearchPhase = async (phase: ResearchPhase, keyword: string) => {
    if (!state.selectedAssistant || !state.apiKey) {
      throw new Error('No assistant selected or API key missing');
    }

    if (!keyword) {
      throw new Error('No keyword provided');
    }

    try {
      const openai = createOpenAIClient(state.apiKey);
      const thread = await handleOpenAIRequest(
        () => openai.beta.threads.create(),
        'creating research thread'
      );
      
      await handleOpenAIRequest(
        () => openai.beta.threads.messages.create(thread.id, {
          role: 'user',
          content: getResearchPrompt(phase, keyword),
        }),
        'creating research message'
      );

      const run = await handleOpenAIRequest(
        () => openai.beta.threads.runs.create(thread.id, {
          assistant_id: state.selectedAssistant!.id,
        }),
        'starting research analysis'
      );

      let response;
      let attempts = 0;
      const maxAttempts = 60;
      
      while (attempts < maxAttempts) {
        const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        if (runStatus.status === 'completed') {
          response = await openai.beta.threads.messages.list(thread.id);
          break;
        } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
          throw new Error(`Research ${runStatus.status}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!response) {
        throw new Error('Research timed out');
      }

      const lastMessage = response.data[0];
      
      setState(prev => ({
        ...prev,
        researchThreads: {
          ...prev.researchThreads,
          [phase]: {
            threadId: thread.id,
            messages: [{
              id: lastMessage.id,
              role: 'assistant',
              content: lastMessage.content[0].text.value,
              createdAt: Date.now(),
            }],
            completed: true,
            results: lastMessage.content[0].text.value,
            timestamp: Date.now()
          },
        },
      }));

      return true;
    } catch (error) {
      console.error('Research phase failed:', error);
      setState(prev => ({ 
        ...prev, 
        researchThreads: {
          ...prev.researchThreads,
          [phase]: null,
        },
      }));
      throw error;
    }
  };

  const sendMessage = async (content: string) => {
    if (!state.threadId || !state.selectedAssistant || !state.apiKey) {
      throw new Error('Thread, assistant, or API key not initialized');
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      messages: [
        ...prev.messages,
        {
          id: Date.now().toString(),
          role: 'user',
          content,
          createdAt: Date.now(),
        },
      ],
    }));

    try {
      const openai = createOpenAIClient(state.apiKey);
      
      await handleOpenAIRequest(
        () => openai.beta.threads.messages.create(state.threadId!, {
          role: 'user',
          content,
        }),
        'sending message'
      );

      const run = await handleOpenAIRequest(
        () => openai.beta.threads.runs.create(state.threadId!, {
          assistant_id: state.selectedAssistant!.id,
        }),
        'processing message'
      );

      let response;
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        const runStatus = await openai.beta.threads.runs.retrieve(
          state.threadId,
          run.id
        );

        if (runStatus.status === 'completed') {
          response = await openai.beta.threads.messages.list(state.threadId);
          break;
        } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
          throw new Error('Assistant failed to respond');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!response) {
        throw new Error('Response timed out');
      }

      const lastMessage = response.data[0];
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        messages: [
          ...prev.messages,
          {
            id: lastMessage.id,
            role: 'assistant',
            content: lastMessage.content[0].text.value,
            createdAt: Date.now(),
          },
        ],
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(getErrorMessage(error, 'sending message'));
    }
  };

  const value: OpenAIContextType = {
    state,
    connect,
    disconnect,
    selectAssistant,
    goBack,
    proceedToChat,
    sendMessage,
    startResearchPhase,
  };

  return (
    <OpenAIContext.Provider value={value}>
      {children}
    </OpenAIContext.Provider>
  );
}

export function useOpenAI() {
  const context = useContext(OpenAIContext);
  if (context === undefined) {
    throw new Error('useOpenAI must be used within an OpenAIProvider');
  }
  return context;
}