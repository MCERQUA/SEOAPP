import React, { createContext, useContext, useState } from 'react';
import type { OpenAIState, OpenAIContextType, Message } from '../types/openai';
import type { ResearchPhase, ResearchData, ResearchState } from '../types/research';
import { verifyApiKey } from '../utils/openai';
import { getResearchPrompt } from '../utils/research';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';
import OpenAI from 'openai';
import { toast } from 'sonner';

const initialResearchState: ResearchState = {
  topic: null,
  intent: null,
  structure: null,
  ymyl: null,
  tone: null,
  outline: null,
  userContent: null,
  article: null,
  keywords: null
};

const initialState: OpenAIState = {
  apiKey: null,
  assistants: [],
  selectedAssistant: null,
  isConnected: false,
  showChat: false,
  messages: [],
  isLoading: false,
  threadId: null,
  researchThreads: initialResearchState,
  articleGeneration: {
    status: 'idle',
    content: null,
  },
  userContent: {
    links: [],
    media: [],
    additionalContent: {
      companyInfo: '',
      specialNotes: '',
      teamCredentials: '',
      ctaPreferences: '',
    },
  },
};

const OpenAIContext = createContext<OpenAIContextType | undefined>(undefined);

export function OpenAIProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OpenAIState>(initialState);

  const getOpenAIClient = () => {
    if (!state.apiKey) throw new Error('API key not found');
    return new OpenAI({ 
      apiKey: state.apiKey,
      dangerouslyAllowBrowser: true
    });
  };

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
    if (!state.selectedAssistant) {
      throw new Error('No assistant selected');
    }

    try {
      const openai = getOpenAIClient();
      const thread = await openai.beta.threads.create();
      
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
    if (!state.selectedAssistant) {
      throw new Error('No assistant selected');
    }

    if (!keyword) {
      throw new Error('No keyword provided');
    }

    try {
      const openai = getOpenAIClient();
      const thread = await openai.beta.threads.create();
      
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: getResearchPrompt(phase, keyword),
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: state.selectedAssistant.id,
      });

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
    } catch (error: any) {
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
    if (!state.threadId || !state.selectedAssistant) {
      throw new Error('Thread or assistant not initialized');
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
      const openai = getOpenAIClient();
      
      await openai.beta.threads.messages.create(state.threadId, {
        role: 'user',
        content,
      });

      const run = await openai.beta.threads.runs.create(state.threadId, {
        assistant_id: state.selectedAssistant.id,
      });

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
      throw error;
    }
  };

  const getResearchResults = (phase: ResearchPhase): ResearchData | null => {
    return state.researchThreads[phase];
  };

  const generateArticle = async (content: string) => {
    if (!state.selectedAssistant) {
      throw new Error('No assistant selected');
    }

    setState(prev => ({
      ...prev,
      articleGeneration: {
        status: 'generating',
        content: null,
      },
    }));

    try {
      const openai = getOpenAIClient();
      const thread = await openai.beta.threads.create();
      
      const researchSummary = Object.entries(state.researchThreads)
        .filter(([_, data]) => data?.completed)
        .map(([phase, data]) => `${phase.toUpperCase()} RESEARCH:\n${data?.results}`)
        .join('\n\n');
      
      const prompt = `Generate a comprehensive article based on our research:\n\n${researchSummary}`;

      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: prompt,
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: state.selectedAssistant.id,
      });

      let response;
      let attempts = 0;
      const maxAttempts = 120;

      while (attempts < maxAttempts) {
        const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        if (runStatus.status === 'completed') {
          response = await openai.beta.threads.messages.list(thread.id);
          break;
        } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
          throw new Error(`Article generation ${runStatus.status}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!response) {
        throw new Error('Article generation timed out');
      }

      const articleContent = response.data[0].content[0].text.value;

      setState(prev => ({
        ...prev,
        articleGeneration: {
          status: 'complete',
          content: articleContent,
        },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        articleGeneration: {
          status: 'error',
          content: null,
          error: error.message,
        },
      }));
      throw error;
    }
  };

  const updateUserContent = (content: Partial<OpenAIState['userContent']>) => {
    setState(prev => ({
      ...prev,
      userContent: {
        ...prev.userContent,
        ...content,
      },
    }));
  };

  const updateAssistant = async (assistantId: string, changes: {
    model?: string;
    instructions?: string;
    tools?: Array<{ type: string }>;
    temperature?: number;
    topP?: number;
  }) => {
    if (!state.apiKey) throw new Error('API key not found');

    try {
      const openai = getOpenAIClient();

      const updatedAssistant = await openai.beta.assistants.update(
        assistantId,
        changes
      );

      setState(prev => ({
        ...prev,
        assistants: prev.assistants.map(a => 
          a.id === assistantId ? updatedAssistant : a
        ),
        selectedAssistant: prev.selectedAssistant?.id === assistantId 
          ? updatedAssistant 
          : prev.selectedAssistant
      }));

      return updatedAssistant;
    } catch (error) {
      console.error('Failed to update assistant:', error);
      throw error;
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
    getResearchResults,
    generateArticle,
    updateUserContent,
    updateAssistant,
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