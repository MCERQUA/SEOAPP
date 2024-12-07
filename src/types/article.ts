import type { ResearchPhase } from './research';

export interface ArticleGenerationState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  content: string | null;
  error?: string;
  metadata?: {
    title: string;
    description: string;
    wordCount: number;
    readingTime: number;
  };
}

export interface ArticleAnalysis {
  score: number;
  phaseScores: Record<ResearchPhase, number>;
  implementedPoints: number;
  totalPoints: number;
  suggestions: string[];
}

export interface ArticleSection {
  heading: string;
  content: string;
  subsections: ArticleSection[];
  implementedResearch: {
    phase: ResearchPhase;
    points: string[];
  }[];
}

export interface ArticleStructure {
  title: string;
  sections: ArticleSection[];
}