import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  breaks: true,
  gfm: true,
});

export function formatMessage(content: string): string {
  // Convert markdown to HTML
  const rawHtml = marked(content);
  
  // Sanitize HTML to prevent XSS
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'code', 'pre', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'a'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });

  return cleanHtml;
}