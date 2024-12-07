export type ResearchPhase = 
  | 'keywords'
  | 'topic'
  | 'intent'
  | 'structure'
  | 'ymyl'
  | 'tone'
  | 'outline'
  | 'userContent'
  | 'article';

export interface ResearchMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  createdAt: number;
}

export interface ResearchData {
  threadId: string;
  messages: ResearchMessage[];
  completed: boolean;
  results: string;
  timestamp: number;
}

export type ResearchState = {
  [K in ResearchPhase]: ResearchData | null;
};

export interface ResearchAnalysis {
  phase: ResearchPhase;
  items: {
    point: string;
    implemented: boolean;
    context?: string;
  }[];
  score: number;
}