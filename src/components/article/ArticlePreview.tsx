import React, { useState } from 'react';
import { Download, FileText, Code, Copy, Check } from 'lucide-react';
import { createPreviewHtml, formatArticleHtml } from '../../utils/articleFormatter';

interface ArticlePreviewProps {
  content: string;
}

export default function ArticlePreview({ content }: ArticlePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  const handleDownloadHtml = () => {
    const htmlContent = formatArticleHtml(content);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-article.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = async () => {
    const htmlContent = formatArticleHtml(content);
    await navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewHtml = createPreviewHtml(content);
  const rawHtml = formatArticleHtml(content);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'html'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Code className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 
              text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy HTML'}</span>
          </button>
          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 
              text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
        {activeTab === 'preview' ? (
          <div 
            className="prose prose-invert max-w-none p-6"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <pre className="p-6 text-sm overflow-x-auto">
            <code className="text-zinc-300 whitespace-pre-wrap">
              {rawHtml}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}