import React from 'react';
import { useOpenAI } from '../../context/OpenAIContext';
import type { ResearchPhase } from '../../types/research';
import ResearchPhaseButton from './ResearchPhaseButton';
import { getAllPhases, getPhaseLabel } from '../../utils/research';

interface ResearchNavigationProps {
  activePhase: ResearchPhase;
  onPhaseChange: (phase: ResearchPhase) => void;
  currentKeyword: string;
  isResearching: boolean;
}

export default function ResearchNavigation({ 
  activePhase, 
  onPhaseChange,
  currentKeyword,
  isResearching
}: ResearchNavigationProps) {
  const { state } = useOpenAI();
  const phases = getAllPhases();

  return (
    <div className="space-y-4">
      {currentKeyword && (
        <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg lg:block hidden">
          <p className="text-sm text-zinc-500">Current Keyword</p>
          <p className="text-white font-medium truncate">{currentKeyword}</p>
        </div>
      )}
      
      <div className="space-y-2">
        {phases.map((phase) => (
          <ResearchPhaseButton
            key={phase}
            phase={phase}
            label={getPhaseLabel(phase)}
            isActive={activePhase === phase}
            isComplete={!!state.researchThreads[phase]?.completed}
            isLoading={isResearching && !state.researchThreads[phase]?.completed}
            onClick={() => onPhaseChange(phase)}
            disabled={isResearching}
          />
        ))}
      </div>
    </div>
  );
}