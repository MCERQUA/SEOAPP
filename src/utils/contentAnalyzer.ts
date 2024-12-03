import type { ResearchPhase, ResearchState } from '../types/research';

interface AnalysisItem {
  point: string;
  implemented: boolean;
}

interface PhaseAnalysis {
  items: AnalysisItem[];
  score: number;
}

export function calculateContentScore(researchData: ResearchState, articleContent: string): number {
  const phases: ResearchPhase[] = ['topic', 'intent', 'structure', 'ymyl', 'tone', 'visual', 'outline'];
  
  const weights = {
    topic: 0.2,
    intent: 0.15,
    structure: 0.15,
    ymyl: 0.1,
    tone: 0.15,
    visual: 0.1,
    outline: 0.15
  };

  let totalScore = 0;
  let totalWeight = 0;

  phases.forEach(phase => {
    if (researchData[phase]?.messages[0]?.content) {
      const analysis = analyzePhaseContent(
        phase,
        researchData[phase].messages[0].content,
        articleContent
      );
      totalScore += analysis.score * weights[phase];
      totalWeight += weights[phase];
    }
  });

  return Math.round((totalScore / totalWeight) * 100);
}

export function analyzePhaseContent(
  phase: ResearchPhase,
  researchContent: string,
  articleContent: string
): PhaseAnalysis {
  if (!researchContent || !articleContent) {
    return { items: [], score: 0 };
  }

  // Extract bullet points from research content
  const points = researchContent
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim());

  // Analyze implementation of each point
  const items = points.map(point => ({
    point,
    implemented: isPointImplemented(point, articleContent)
  }));

  // Calculate score based on implementation
  const score = items.length > 0
    ? items.filter(item => item.implemented).length / items.length
    : 0;

  return { items, score };
}

function isPointImplemented(point: string, content: string): boolean {
  const keywords = point
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3);

  const contentLower = content.toLowerCase();
  
  // Consider a point implemented if at least 70% of its keywords are found
  const foundKeywords = keywords.filter(keyword => contentLower.includes(keyword));
  return foundKeywords.length / keywords.length >= 0.7;
}