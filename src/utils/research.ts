import type { ResearchPhase } from '../types/research';

const RESEARCH_PROMPTS: Record<ResearchPhase, (keyword: string) => string> = {
  keywords: (keyword: string) => `Act as an SEO Keyword Research Specialist. Analyze the keyword "${keyword}" and provide:
- Primary keyword variations and search intent
- Secondary keywords with search volume estimates
- LSI (Latent Semantic Indexing) keywords and their relevance
- Related questions from search engines
- Long-tail keyword opportunities
- Competitor keyword analysis and gaps

Format your response with clear sections and prioritized recommendations.`,

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

  outline: (keyword: string) => `Act as an SEO Content Outline Specialist. Create a comprehensive content outline for "${keyword}" incorporating previous analyses. Provide:
- Compelling introduction approach
- Main sections with key points
- Subsections and their focus
- Supporting element placements
- Conclusion and call-to-action strategy
- Word count recommendations per section

Format your response as a structured outline with clear hierarchy and explanations.`,

  keywords: (keyword: string) => `Act as an SEO Keyword Research Specialist. Analyze the keyword "${keyword}" and provide:
- Primary keyword analysis and search volume
- Secondary keyword opportunities
- LSI (Latent Semantic Indexing) keywords
- Related questions and search queries
- Long-tail keyword variations
- Competitor keyword analysis

Format your response with clear sections and prioritized recommendations.`,

  userContent: (keyword: string) => `Act as a Content Integration Specialist. Analyze how to integrate user-provided content for "${keyword}". Consider:
- Website/URL integration points
- Media asset placement strategy
- Company information incorporation
- Team credentials presentation
- Call-to-action optimization

Format your response with specific recommendations for each content type.`
};

export function getResearchPrompt(phase: ResearchPhase, keyword: string): string {
  if (!RESEARCH_PROMPTS[phase]) {
    throw new Error(`Invalid research phase: ${phase}`);
  }
  return RESEARCH_PROMPTS[phase](keyword);
}

export function getPhaseLabel(phase: ResearchPhase): string {
  const labels: Record<ResearchPhase, string> = {
    keywords: 'Keyword Research',
    topic: 'Topic Analysis',
    intent: 'User Intent',
    structure: 'Content Structure',
    ymyl: 'YMYL Assessment',
    tone: 'Tone & Style',
    outline: 'Final Outline',
    userContent: 'User Content',
    article: 'Generate Article'
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
    'outline'
  ];
  
  const currentIndex = phases.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex === phases.length - 1) {
    return null;
  }
  return phases[currentIndex + 1];
}

export function formatResearchHtml(title: string, content: string, keyword: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${keyword}</title>
    <style>
        :root {
            --primary-color: #10b981;
            --text-color: #1f2937;
            --bg-color: #ffffff;
            --heading-color: #111827;
            --link-color: #059669;
            --code-bg: #f3f4f6;
            --quote-bg: #f9fafb;
            --quote-border: #e5e7eb;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --primary-color: #34d399;
                --text-color: #e5e7eb;
                --bg-color: #111827;
                --heading-color: #f9fafb;
                --link-color: #6ee7b7;
                --code-bg: #1f2937;
                --quote-bg: #1f2937;
                --quote-border: #374151;
            }
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: var(--bg-color);
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }

        header {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--quote-border);
        }

        h1 {
            color: var(--heading-color);
            font-size: 2.5rem;
            margin: 0 0 0.5rem 0;
        }

        .keyword {
            color: var(--primary-color);
            font-size: 1.25rem;
            margin: 0;
        }

        main {
            font-size: 1.125rem;
        }

        ul {
            margin: 1.5rem 0;
            padding-left: 1.5rem;
        }

        li {
            margin: 0.5rem 0;
        }

        strong {
            color: var(--heading-color);
        }

        footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 2px solid var(--quote-border);
            font-size: 0.875rem;
            color: var(--primary-color);
        }

        @media (max-width: 768px) {
            body {
                padding: 1rem;
                font-size: 1rem;
            }

            h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>${title}</h1>
        <p class="keyword">Target Keyword: ${keyword}</p>
    </header>
    
    <main>
        ${content}
    </main>
    
    <footer>
        Generated by SEO AI Content Generator
    </footer>
</body>
</html>`
}

export function getAllPhases(): ResearchPhase[] {
  return [
    'keywords',
    'topic',
    'intent',
    'structure',
    'ymyl',
    'tone',
    'outline',
    'userContent',
    'article'
  ];
}

export function getAutomatedPhases(): ResearchPhase[] {
  return [
    'keywords',
    'topic',
    'intent',
    'structure',
    'ymyl',
    'tone',
    'outline'
  ];
}