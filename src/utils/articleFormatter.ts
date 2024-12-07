import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked renderer to handle headings properly
const renderer = new marked.Renderer();
renderer.heading = (text, level) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id="${escapedText}">${text}</h${level}>`;
};

marked.setOptions({
  renderer,
  headerIds: true,
  gfm: true
});

export function formatArticleHtml(markdownContent: string): string {
  // Strip markdown heading markers and format properly
  const processedContent = markdownContent.replace(/^##?\s+/gm, '');
  
  // Convert markdown to HTML
  const articleHtml = marked(processedContent);
  
  // Sanitize HTML
  const cleanHtml = DOMPurify.sanitize(articleHtml);

  // Create a complete HTML document with styling
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Article</title>
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
            font-size: 1.125rem;
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--heading-color);
            line-height: 1.3;
            margin-top: 2em;
            margin-bottom: 1em;
        }

        h1 { font-size: 2.5rem; margin-top: 0; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.75rem; }
        h4 { font-size: 1.5rem; }
        h5 { font-size: 1.25rem; }
        h6 { font-size: 1.1rem; }

        p { margin: 1.5em 0; }

        ul, ol {
            margin: 1.5em 0;
            padding-left: 2em;
        }

        li {
            margin: 0.5em 0;
        }

        a {
            color: var(--link-color);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
        }

        a:hover {
            border-bottom-color: var(--link-color);
        }

        blockquote {
            margin: 2em 0;
            padding: 1em 1.5em;
            border-left: 4px solid var(--quote-border);
            background: var(--quote-bg);
            font-style: italic;
        }

        code {
            background: var(--code-bg);
            padding: 0.2em 0.4em;
            border-radius: 0.25em;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.9em;
        }

        pre {
            background: var(--code-bg);
            padding: 1.5em;
            border-radius: 0.5em;
            overflow-x: auto;
            margin: 2em 0;
        }

        pre code {
            background: transparent;
            padding: 0;
            border-radius: 0;
        }

        img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5em;
            margin: 2em 0;
        }

        hr {
            border: none;
            border-top: 2px solid var(--quote-border);
            margin: 3em 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2em 0;
        }

        th, td {
            border: 1px solid var(--quote-border);
            padding: 0.75em;
            text-align: left;
        }

        th {
            background: var(--quote-bg);
            font-weight: 600;
        }

        @media (max-width: 768px) {
            body {
                padding: 1rem;
                font-size: 1rem;
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
    ${cleanHtml}
</body>
</html>`;
}

// Function to create a preview version of the HTML (without full document structure)
export function createPreviewHtml(markdownContent: string): string {
  const processedContent = markdownContent.replace(/^##?\s+/gm, '');
  const articleHtml = marked(processedContent);
  return DOMPurify.sanitize(articleHtml);
}