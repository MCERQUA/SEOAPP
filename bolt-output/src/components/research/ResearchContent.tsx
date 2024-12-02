import React from 'react';
import { useOpenAI } from '@/../context/OpenAIContext';
import type { ResearchPhase } from '@/../types/research';
import { Loader2 } from 'lucide-react';
import { getPhaseLabel } from '@/../utils/research';

interface ResearchContentProps {
  phase: ResearchPhase;
  keyword: string;
  isResearching: boolean;
}

export default function ResearchContent({ phase, keyword, isResearching }: ResearchContentProps) {
  const { state } = useOpenAI();
  const researchData = state.researchThreads[phase];

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
          <p className="text-zinc-400">Analyzing {getPhaseLabel(phase).toLowerCase()} for "{keyword}"...</p>
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

  return (
    <div className="prose prose-invert max-w-none">
      {researchData.messages.map((message) => (
        <div key={message.id} className="mb-6">
          <div 
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        </div>
      ))}
    </div>
  );
}