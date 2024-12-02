import type { Assistant } from 'openai/resources/beta/assistants/assistants';
import type { ResearchPhase, ResearchState, ResearchData } from './research';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface OpenAIState {
  apiKey: string | null;
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  isConnected: boolean;
  showChat: boolean;
  messages: Message[];
  isLoading: boolean;
  threadId: string | null;
  researchThreads: ResearchState;
  articleGeneration: {
    status: 'idle' | 'generating' | 'complete' | 'error';
    content: string | null;
    error?: string;
  };
  userContent: {
    links: Array<{
      id: string;
      url: string;
      type: 'website' | 'product' | 'resource';
    }>;
    media: Array<{
      id: string;
      content: string;
      type: 'image' | 'video' | 'iframe';
    }>;
    additionalContent: {
      companyInfo: string;
      specialNotes: string;
      teamCredentials: string;
      ctaPreferences: string;
    };
  };
}

export type OpenAIContextType = {
  state: OpenAIState;
  connect: (apiKey: string) => Promise<void>;
  disconnect: () => void;
  selectAssistant: (assistant: Assistant) => void;
  goBack: () => void;
  proceedToChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  startResearchPhase: (phase: ResearchPhase, keyword: string) => Promise<void>;
  getResearchResults: (phase: ResearchPhase) => ResearchData | null;
  generateArticle: (content: string) => Promise<void>;
};