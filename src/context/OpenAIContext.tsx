import React, { createContext, useContext, useState } from 'react';
import type { OpenAIState, OpenAIContextType, Message } from '../types/openai';
import type { ResearchPhase, ResearchData, ResearchState } from '../types/research';
import { verifyApiKey } from '../utils/openai';
import { getResearchPrompt } from '../utils/research';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';
import OpenAI from 'openai';
import { toast } from 'sonner';

const OpenAIContext = createContext<OpenAIContextType | undefined>(undefined);

const initialResearchState: ResearchState = {
  topic: null,
  intent: null,
  structure: null,
  ymyl: null,
  tone: null,
  visual: null,
  outline: null
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
      
      // Create the message with the research prompt
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: getResearchPrompt(phase, keyword),
      });

      // Start the analysis
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: state.selectedAssistant.id,
      });

      // Wait for completion with timeout
      let response;
      let attempts = 0;
      const maxAttempts = 60; // 1 minute timeout
      
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
      
      // Update state with the new research data
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
      
      // Compile research data
      const researchSummary = Object.entries(state.researchThreads)
        .filter(([_, data]) => data?.completed)
        .map(([phase, data]) => `${phase.toUpperCase()} RESEARCH:\n${data?.results}`)
        .join('\n\n');
      
      // Create comprehensive prompt
      const prompt = `Generate a comprehensive, well-structured article of 3000-4000 words based on our research:

${researchSummary}
${state.userContent ? `

USER PROVIDED CONTENT:
Company Information: ${state.userContent.additionalContent.companyInfo}
Special Notes: ${state.userContent.additionalContent.specialNotes}
Team Credentials: ${state.userContent.additionalContent.teamCredentials}
CTA Preferences: ${state.userContent.additionalContent.ctaPreferences}

Links:
${state.userContent.links.map(link => `- ${link.type}: ${link.url}`).join('\n')}

Media:
${state.userContent.media.map(item => `- ${item.type}: ${item.content}`).join('\n')}
` : ''}

Additional Requirements:
- Length: 3000-4000 words
- Use proper HTML heading hierarchy (h1 for title, h2 for main sections, h3 for subsections)
- Include meta description and title tags
- Incorporate relevant statistics and data points
- Use engaging examples and case studies
- Maintain consistent tone and style
- Include actionable takeaways
- Optimize for SEO best practices
- Include provided media assets in appropriate sections
- Add internal links to provided URLs
- End with the specified call-to-action

Format the article in Markdown with proper HTML heading hierarchy and SEO structure.`;

      // Send the prompt
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: prompt,
      });

      // Start the generation
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: state.selectedAssistant.id,
      });

      // Wait for completion with extended timeout (2 minutes)
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