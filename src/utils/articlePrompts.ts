export const ARTICLE_PROMPTS = {
  generateHtml: (keyword: string, research: any) => `
Generate a complete, SEO-optimized HTML article about "${keyword}". Use proper HTML5 semantic structure.

Research Context:
${JSON.stringify(research, null, 2)}

Requirements:
- Use semantic HTML5 elements (<article>, <section>, <header>, etc.)
- Include meta tags and SEO elements
- Add schema.org markup for the article
- Use proper heading hierarchy (h1-h6)
- Include responsive images where relevant
- Add internal links and citations
- Optimize for readability with proper spacing and typography
- Include a table of contents
- Add proper alt text for images
- Include structured data

Format the response as a complete, production-ready HTML document with embedded CSS.
`.trim(),

  generateOutline: (keyword: string, research: any) => `
Create a detailed outline for an article about "${keyword}" based on the research data.

Research Context:
${JSON.stringify(research, null, 2)}

Requirements:
- Include all major sections and subsections
- Follow proper heading hierarchy
- Include estimated word counts per section
- Note key points to cover
- Identify areas for examples/case studies
- Mark spots for visuals/diagrams
- Suggest internal linking opportunities

Format the response as a structured outline with clear hierarchy.
`.trim()
};