import type { ResearchPhase } from '@/types/research';

const RESEARCH_PROMPTS: Record<ResearchPhase, (keyword: string) => string> = {
  topic: (keyword: string) => `Analyze the topic "${keyword}" in depth. Consider:
- Main concepts and subtopics
- Key areas of focus
- Related topics and themes
- Potential angles and perspectives
- Knowledge prerequisites
- Common misconceptions
Provide a comprehensive topic analysis that will guide content creation.`,

  intent: (keyword: string) => `Analyze user intent for "${keyword}". Consider:
- Primary user goals (informational, transactional, navigational)
- Questions users are trying to answer
- Pain points they're trying to solve
- Knowledge level they're seeking
- Expected outcomes from reading the content
Provide a detailed user intent analysis to guide content direction.`,

  structure: (keyword: string) => `Recommend content structure for "${keyword}". Consider:
- Best format for this topic (how-to, guide, list, etc.)
- Logical content flow
- Required sections
- Supporting elements needed
- Information hierarchy
Provide a detailed structural recommendation with reasoning.`,

  ymyl: (keyword: string) => `Evaluate if "${keyword}" is a Your Money Your Life (YMYL) topic. Consider:
- Impact on readers' wellbeing
- Financial implications
- Health and safety factors
- Legal or professional implications
- Required expertise level
- Trust signals needed
Provide a YMYL assessment with specific content requirements.`,

  tone: (keyword: string) => `Recommend tone and style for "${keyword}" content. Consider:
- Appropriate voice (formal, casual, technical)
- Writing style
- Language complexity
- Use of technical terms
- Engagement approach
Provide detailed tone and style guidelines.`,

  visual: (keyword: string) => `Plan visual content for "${keyword}". Recommend:
- Types of images needed
- Diagram opportunities
- Chart or graph suggestions
- Infographic potential
- Visual hierarchy
Provide a comprehensive visual content plan.`,

  outline: (keyword: string) => `Create a detailed content outline for "${keyword}" incorporating all previous analysis. Include:
- Introduction approach
- Main sections and subsections
- Key points for each section
- Supporting elements placement
- Conclusion strategy
Provide a complete content outline that incorporates tone, structure, and visual recommendations.`
};

export function getResearchPrompt(phase: ResearchPhase, keyword: string): string {
  const prompt = RESEARCH_PROMPTS[phase](keyword);
  return prompt;
}