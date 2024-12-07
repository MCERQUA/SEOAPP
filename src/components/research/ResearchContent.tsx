import React, { useState } from 'react';
import { useOpenAI } from '../../context/OpenAIContext';
import type { ResearchPhase } from '../../types/research';
import { Loader2, Download, Copy, Check, ChevronDown } from 'lucide-react';
import KeywordResearch from './KeywordResearch';
import UserContent from './UserContent';
import { getPhaseLabel, formatResearchHtml } from '../../utils/research';
import { toast } from 'sonner';

interface ResearchContentProps {
  phase: ResearchPhase;
  keyword: string;
  isResearching: boolean;
  onKeywordSubmit: (keyword: string) => void;
}

export default function ResearchContent({ phase, keyword, isResearching, onKeywordSubmit }: ResearchContentProps) {
  const { state } = useOpenAI();
  const researchData = state.researchThreads[phase];
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = React.useState(false);

  if (phase === 'userContent') {
    return (
      <div className="space-y-6">
        <UserContent 
          onKeywordSubmit={keyword ? undefined : onKeywordSubmit}
          isResearching={isResearching}
        />
      </div>
    );
  }

  if (!keyword) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-zinc-400 mb-2">Enter a keyword above to begin research</p>
        <p className="text-zinc-500 text-sm">
          We'll analyze your topic across multiple dimensions
        </p>
      </div>
    );
  }

  if (isResearching && !researchData?.completed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <p className="text-zinc-400">
            {phase === 'keywords' ? 'Starting keyword research' : `Analyzing ${getPhaseLabel(phase).toLowerCase()}`} 
            for "{keyword}"...
          </p>
        </div>
      </div>
    );
  }

  if (!researchData?.completed) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-zinc-400">Waiting to analyze {getPhaseLabel(phase).toLowerCase()} for "{keyword}"</p>
      </div>
    );
  }

  const handleDownload = () => {
    if (!researchData?.messages[0]?.content) return;
    
    try {
      const htmlContent = formatResearchHtml(
        getPhaseLabel(phase),
        researchData.messages[0].content,
        keyword
      );
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${phase}-research.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Research downloaded successfully');
    } catch (error) {
      toast.error('Failed to download research', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  const handleCopy = async () => {
    if (!researchData?.messages[0]?.content) return;
    
    try {
      await navigator.clipboard.writeText(researchData.messages[0].content);
      setCopied(true);
      toast.success('Research copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy research', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  const handleDownloadText = () => {
    if (!researchData?.messages[0]?.content) return;
    
    try {
      const blob = new Blob([researchData.messages[0].content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${phase}-research.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Research downloaded successfully');
    } catch (error) {
      toast.error('Failed to download research', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white capitalize">
            {state.userContent.articleTitle || getPhaseLabel(phase)}
          </h2>
          <p className="text-sm font-medium text-emerald-500 mt-1">
            {getPhaseLabel(phase)}
          </p>
          <p className="text-sm text-zinc-400 mt-1">
            {researchData?.completed ? 'Research completed' : 'Research in progress'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {researchData?.completed && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 
                  text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadText}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 
                  text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Text</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 
                  text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download HTML</span>
              </button>
            </div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronDown 
              className={`w-5 h-5 text-zinc-400 transition-transform duration-200
                ${isExpanded ? 'transform rotate-180' : ''}`}
            />
          </button>
      </div>
      </div>

      <div className={`space-y-4 transition-all duration-300 ${
        isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
      }`}>
        <div className="prose prose-invert max-w-none bg-zinc-900">
          {researchData?.messages.map((message) => (
            <div key={message.id} className="mb-6">
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}