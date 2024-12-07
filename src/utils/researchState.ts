import type { ResearchPhase, ResearchState, ResearchData, ResearchAnalysis } from '../types/research';

export function getInitialResearchState(): ResearchState {
  return {
    keywords: null,
    topic: null,
    intent: null,
    structure: null,
    ymyl: null,
    tone: null,
    outline: null,
    userContent: null,
    article: null
  };
}

export function analyzeResearchImplementation(
  phase: ResearchPhase,
  researchData: ResearchData | null,
  articleContent: string
): ResearchAnalysis {
  if (!researchData?.results || !articleContent) {
    return {
      phase,
      items: [],
      score: 0
    };
  }

  const points = researchData.results
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim());

  const items = points.map(point => {
    const implemented = isPointImplemented(point, articleContent);
    return {
      point,
      implemented,
      context: implemented ? findContext(point, articleContent) : undefined
    };
  });

  return {
    phase,
    items,
    score: items.length > 0 
      ? (items.filter(item => item.implemented).length / items.length) * 100
      : 0
  };
}

function isPointImplemented(point: string, content: string): boolean {
  const keywords = point
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3);

  const contentLower = content.toLowerCase();
  const foundKeywords = keywords.filter(keyword => contentLower.includes(keyword));
  return foundKeywords.length / keywords.length >= 0.7;
}

function findContext(point: string, content: string): string | undefined {
  const keywords = point
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3);

  const sentences = content.split(/[.!?]+/);
  
  return sentences.find(sentence => 
    keywords.every(keyword => 
      sentence.toLowerCase().includes(keyword)
    )
  );
}