import type { ArticleGenerationState, ArticleAnalysis, ArticleSection } from '../types/article';
import type { ResearchPhase, ResearchState } from '../types/research';

export function getInitialArticleState(): ArticleGenerationState {
  return {
    status: 'idle',
    content: null,
  };
}

export function calculateArticleMetrics(content: string) {
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return {
    wordCount,
    readingTime,
  };
}

export function extractArticleSections(content: string): ArticleSection[] {
  const sections: ArticleSection[] = [];
  const lines = content.split('\n');
  let currentSection: ArticleSection | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line.replace('## ', '').trim(),
        content: '',
        subsections: [],
        implementedResearch: []
      };
    } else if (line.startsWith('### ') && currentSection) {
      currentSection.subsections.push({
        heading: line.replace('### ', '').trim(),
        content: '',
        subsections: [],
        implementedResearch: []
      });
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

export function analyzeArticleContent(
  content: string,
  research: ResearchState
): ArticleAnalysis {
  const sections = extractArticleSections(content);
  const phaseScores: Record<ResearchPhase, number> = {} as Record<ResearchPhase, number>;
  let implementedPoints = 0;
  let totalPoints = 0;
  const suggestions: string[] = [];

  // Analyze each research phase
  Object.entries(research).forEach(([phase, data]) => {
    if (!data?.results) return;

    const points = data.results
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());

    const implemented = points.filter(point => 
      content.toLowerCase().includes(point.toLowerCase())
    );

    phaseScores[phase as ResearchPhase] = implemented.length / points.length;
    implementedPoints += implemented.length;
    totalPoints += points.length;

    // Add suggestions for unimplemented points
    points
      .filter(point => !implemented.includes(point))
      .forEach(point => {
        suggestions.push(`Consider incorporating "${point}" from ${phase} research`);
      });
  });

  const score = totalPoints > 0 ? (implementedPoints / totalPoints) * 100 : 0;

  return {
    score: Math.round(score),
    phaseScores,
    implementedPoints,
    totalPoints,
    suggestions
  };
}