import React, { useState } from 'react';
import ResearchPhaseAnalysis from './ResearchPhaseAnalysis';
import type { ResearchPhase, ResearchState } from '../../types/research';
import { getPhaseLabel } from '../../utils/research';

interface ResearchAnalysisProps {
  researchData: ResearchState;
  articleContent: string;
}

export default function ResearchAnalysis({ researchData, articleContent }: ResearchAnalysisProps) {
  const [activePhase, setActivePhase] = useState<ResearchPhase>('topic');
  const phases: ResearchPhase[] = ['topic', 'intent', 'structure', 'ymyl', 'tone', 'visual', 'outline'];

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-2">Research Implementation Analysis</h2>
      <p className="text-sm text-zinc-400 mb-6">
        Review how your research has been implemented and refine your article by adding or removing components.
      </p>

      <div className="space-y-6">
        {/* Phase Navigation */}
        <div className="grid grid-cols-3 lg:grid-cols-7 gap-2 bg-zinc-800 p-1 rounded-lg">
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${activePhase === phase 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
            >
              {getPhaseLabel(phase)}
            </button>
          ))}
        </div>

        {/* Phase Content */}
        {researchData[activePhase]?.messages[0]?.content && (
          <ResearchPhaseAnalysis
            phase={activePhase}
            researchContent={researchData[activePhase].messages[0].content}
            articleContent={articleContent}
          />
        )}
      </div>
    </div>
  );
}