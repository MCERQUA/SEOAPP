import { ResearchContent } from '../types/article';
import { ARTICLE_PROMPTS } from './articlePrompts';

export async function generateArticle(researchData: ResearchContent): Promise<string> {
  // Extract research insights
  const research = {
    topic: researchData.topic?.messages[0]?.content,
    intent: researchData.intent?.messages[0]?.content,
    structure: researchData.structure?.messages[0]?.content,
    tone: researchData.tone?.messages[0]?.content,
    outline: researchData.outline?.messages[0]?.content,
    visual: researchData.visual?.messages[0]?.content
  };

  // Generate the HTML content directly
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${extractTitle(research.topic) || 'Generated Article'}</title>
    <meta name="description" content="${generateMetaDescription(research)}">
    <style>
        /* Modern CSS Reset */
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Typography */
        :root {
            --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
            --font-mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace;
            --font-serif: Georgia, Cambria, 'Times New Roman', Times, serif;
        }

        /* Light/Dark Mode Colors */
        :root {
            --bg: #ffffff;
            --text: #1a1a1a;
            --link: #2563eb;
            --link-hover: #1d4ed8;
            --code-bg: #f3f4f6;
            --quote-bg: #f9fafb;
            --border: #e5e7eb;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #1a1a1a;
                --text: #e5e7eb;
                --link: #60a5fa;
                --link-hover: #93c5fd;
                --code-bg: #2a2a2a;
                --quote-bg: #2a2a2a;
                --border: #404040;
            }
        }

        /* Base Styles */
        body {
            font-family: var(--font-sans);
            line-height: 1.6;
            color: var(--text);
            background: var(--bg);
            max-width: 65ch;
            margin: 0 auto;
            padding: 2rem;
        }

        /* Typography */
        h1, h2, h3, h4, h5, h6 {
            line-height: 1.3;
            margin: 2rem 0 1rem;
            font-weight: 600;
        }

        h1 { font-size: 2.5rem; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.75rem; }
        h4 { font-size: 1.5rem; }
        h5 { font-size: 1.25rem; }
        h6 { font-size: 1.1rem; }

        p { margin: 1.5rem 0; }

        /* Links */
        a {
            color: var(--link);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
        }

        a:hover {
            border-bottom-color: var(--link-hover);
        }

        /* Lists */
        ul, ol {
            margin: 1.5rem 0;
            padding-left: 2rem;
        }

        li { margin: 0.5rem 0; }

        /* Code */
        code {
            font-family: var(--font-mono);
            background: var(--code-bg);
            padding: 0.2em 0.4em;
            border-radius: 0.25em;
            font-size: 0.9em;
        }

        /* Quotes */
        blockquote {
            margin: 2rem 0;
            padding: 1rem 1.5rem;
            background: var(--quote-bg);
            border-left: 4px solid var(--border);
            font-style: italic;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
        }

        th, td {
            padding: 0.75rem;
            border: 1px solid var(--border);
            text-align: left;
        }

        /* Images */
        img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 2rem 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            body {
                padding: 1rem;
                font-size: 0.95rem;
            }

            h1 { font-size: 2rem; }
            h2 { font-size: 1.75rem; }
            h3 { font-size: 1.5rem; }
            h4 { font-size: 1.25rem; }
            h5 { font-size: 1.1rem; }
            h6 { font-size: 1rem; }
        }
    </style>
</head>
<body>
    <article>
        <header>
            <h1>${extractTitle(research.topic)}</h1>
            ${generateTableOfContents(research.outline)}
        </header>

        <main>
            ${generateMainContent(research)}
        </main>

        <footer>
            ${generateArticleFooter(research)}
        </footer>
    </article>

    ${generateSchemaMarkup(research)}
</body>
</html>`;
}

// Helper functions
function extractTitle(topicContent?: string): string {
  if (!topicContent) return 'Comprehensive Guide';
  const lines = topicContent.split('\n');
  const titleLine = lines.find(line => line.startsWith('# '));
  return titleLine ? titleLine.replace('# ', '').trim() : 'Comprehensive Guide';
}

function generateMetaDescription(research: Record<string, string | undefined>): string {
  const topic = research.topic || '';
  const intent = research.intent || '';
  
  // Extract first meaningful sentence or fallback to default
  const firstSentence = topic.split('.')[0] || intent.split('.')[0] || 
    'A comprehensive guide providing valuable insights and practical advice.';
  
  return firstSentence.slice(0, 160).trim();
}

function generateTableOfContents(outlineContent?: string): string {
  if (!outlineContent) return '';

  const sections = outlineContent
    .split('\n')
    .filter(line => line.startsWith('## '))
    .map(line => {
      const title = line.replace('## ', '').trim();
      const id = title.toLowerCase().replace(/[^\w]+/g, '-');
      return `<li><a href="#${id}">${title}</a></li>`;
    })
    .join('\n');

  return `
    <nav class="toc">
      <h2>Table of Contents</h2>
      <ol>
        ${sections}
      </ol>
    </nav>
  `;
}

function generateMainContent(research: Record<string, string | undefined>): string {
  const outline = research.outline || '';
  const sections = outline.split('\n');
  
  let content = '';
  let currentSection = '';
  
  for (const line of sections) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        content += generateSection(currentSection, research);
      }
      currentSection = line;
    } else {
      currentSection += '\n' + line;
    }
  }
  
  if (currentSection) {
    content += generateSection(currentSection, research);
  }
  
  return content;
}

function generateSection(sectionContent: string, research: Record<string, string | undefined>): string {
  const title = sectionContent.split('\n')[0].replace('## ', '').trim();
  const id = title.toLowerCase().replace(/[^\w]+/g, '-');
  
  return `
    <section id="${id}">
      <h2>${title}</h2>
      ${generateSectionContent(sectionContent, research)}
    </section>
  `;
}

function generateSectionContent(section: string, research: Record<string, string | undefined>): string {
  // Extract relevant content from research data
  const relevantPoints = Object.values(research)
    .filter(Boolean)
    .join('\n')
    .split('\n')
    .filter(line => 
      line.toLowerCase().includes(section.toLowerCase())
    )
    .map(line => `<p>${line.trim()}</p>`)
    .join('\n');

  return relevantPoints || '<p>This section provides valuable insights and practical guidance.</p>';
}

function generateArticleFooter(research: Record<string, string | undefined>): string {
  return `
    <div class="article-footer">
      <h3>Take Action</h3>
      <p>Ready to implement these insights? Start applying these strategies today and see the difference they can make in your success.</p>
    </div>
  `;
}

function generateSchemaMarkup(research: Record<string, string | undefined>): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': extractTitle(research.topic),
    'description': generateMetaDescription(research),
    'datePublished': new Date().toISOString(),
    'author': {
      '@type': 'Organization',
      'name': 'Generated by AI Content Assistant'
    }
  };

  return `
    <script type="application/ld+json">
      ${JSON.stringify(schema, null, 2)}
    </script>
  `;
}