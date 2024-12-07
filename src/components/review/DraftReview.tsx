import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ResearchAnalysis from './ResearchAnalysis';
import ResearchKnowledge from './ResearchKnowledge';
import { useOpenAI } from '../../context/OpenAIContext';

interface DraftReviewProps {
  onBack: () => void;
}

export default function DraftReview({ onBack }: DraftReviewProps) {
  const { state } = useOpenAI();
  
  if (!state.articleGeneration.content) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">No Article Generated</h2>
          <p className="text-zinc-400">Generate an article first to see the analysis</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-zinc-800 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Chat</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 top-[60px] overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Research Knowledge Card */}
            <div className="lg:col-span-1">
              <ResearchKnowledge 
                researchData={state.researchThreads} 
                articleContent={state.articleGeneration.content} 
              />
            </div>

            {/* Research Analysis */}
            <div className="lg:col-span-2">
              <ResearchAnalysis 
                researchData={state.researchThreads} 
                articleContent={state.articleGeneration.content} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}