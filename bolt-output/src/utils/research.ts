import type { ResearchPhase } from '@/types/research';

const RESEARCH_PROMPTS: Record<ResearchPhase, (keyword: string) => string> = {
  topic: (keyword: string) => `Act as an SEO Content Research Specialist. Analyze the topic "${keyword}" in depth. Consider:
- Main concepts and subtopics that should be covered
- Key areas of focus based on search intent
- Related topics and themes to incorporate
- Potential angles and perspectives to explore
- Knowledge prerequisites for readers
- Common misconceptions to address

Format your response with clear headings and bullet points. Provide actionable insights for content creation.`,
  
  intent: (keyword: string) => `Act as a User Intent Analysis Specialist. Analyze search intent for "${keyword}". Research and provide:
- Primary user goals (informational, transactional, navigational)
- Specific questions users are trying to answer
- Pain points and problems they're trying to solve
- Expected knowledge level of the target audience
- Desired outcomes users seek from the content
- Content format preferences based on intent

Format your response with clear headings and bullet points. Focus on actionable insights.`,

  structure: (keyword: string) => `Act as a Content Structure Specialist. Recommend optimal content structure for "${keyword}". Analyze and provide:
- Most effective content format (how-to, guide, list, etc.)
- Logical flow and progression of information
- Essential sections and their sequence
- Supporting elements and their placement
- Information hierarchy recommendations
- Engagement points throughout the content

Format your response with clear headings and bullet points. Include rationale for recommendations.`,

  ymyl: (keyword: string) => `Act as a YMYL (Your Money Your Life) Content Specialist. Evaluate if "${keyword}" is a YMYL topic. Analyze:
- Potential impact on readers' wellbeing or financial situation
- Health and safety implications
- Legal or professional advice elements
- Required expertise level for accurate coverage
- Trust signals and credibility markers needed
- Compliance and responsibility considerations

Format your response with clear headings and bullet points. Provide specific content requirements.`,

  tone: (keyword: string) => `Act as a Content Style Specialist. Recommend tone and style for "${keyword}" content. Analyze and provide:
- Appropriate voice and tone (formal, casual, technical)
- Writing style guidelines
- Language complexity recommendations
- Technical terminology usage
- Engagement and persuasion approaches
- Brand voice considerations

Format your response with clear headings and bullet points. Include examples where helpful.`,

  visual: (keyword: string) => `Act as a Visual Content Strategist. Plan visual content for "${keyword}". Provide:
- Essential image types and their purposes
- Diagram and illustration opportunities
- Data visualization recommendations
- Infographic potential and structure
- Visual hierarchy guidelines
- Image placement strategy

Format your response with clear headings and bullet points. Include specific visual content recommendations.`,

  outline: (keyword: string) => `Act as an SEO Content Outline Specialist. Create a comprehensive content outline for "${keyword}" incorporating previous analyses. Provide:
- Compelling introduction approach
- Main sections with key points
- Subsections and their focus
- Supporting element placements
- Conclusion and call-to-action strategy
- Word count recommendations per section

Format your response as a structured outline with clear hierarchy and explanations.`
};

export function getResearchPrompt(phase: ResearchPhase, keyword: string): string {
  if (!RESEARCH_PROMPTS[phase]) {
    throw new Error(`Invalid research phase: ${phase}`);
  }
  return RESEARCH_PROMPTS[phase](keyword);
}

export function getPhaseLabel(phase: ResearchPhase): string {
  const labels: Record<ResearchPhase, string> = {
    topic: 'Topic Analysis',
    intent: 'User Intent',
    structure: 'Content Structure',
    ymyl: 'YMYL Assessment',
    tone: 'Tone & Style',
    visual: 'Visual Planning',
    outline: 'Final Outline'
  };
  return labels[phase];
}

export function getNextPhase(currentPhase: ResearchPhase): ResearchPhase | null {
  const phases: ResearchPhase[] = [
    'topic',
    'intent',
    'structure',
    'ymyl',
    'tone',
    'visual',
    'outline'
  ];
  
  const currentIndex = phases.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex === phases.length - 1) {
    return null;
  }
  return phases[currentIndex + 1];
}

export function getAllPhases(): ResearchPhase[] {
  return [
    'topic',
    'intent',
    'structure',
    'ymyl',
    'tone',
    'visual',
    'outline'
  ];
}