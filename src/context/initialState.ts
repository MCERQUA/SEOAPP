import type { OpenAIState } from '../types/openai';

export const initialState: OpenAIState = {
  apiKey: null,
  assistants: [],
  selectedAssistant: null,
  isConnected: false,
  showChat: false,
  messages: [],
  isLoading: false,
  threadId: null,
  researchThreads: {
    topic: null,
    intent: null,
    structure: null,
    ymyl: null,
    tone: null,
    visual: null,
    outline: null,
    userContent: null,
    article: null,
    keywords: null
  },
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