import React from 'react';
import type { ResearchPhase } from '../../types/research';
import { CheckCircle2, Loader2, FileText, Users, LayoutTemplate, AlertTriangle, Palette, Image, LayoutList } from 'lucide-react';

interface ResearchPhaseButtonProps {
  phase: ResearchPhase;
  label: string;
  isActive: boolean;
  isComplete: boolean;
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function getPhaseIcon(phase: ResearchPhase) {
  switch (phase) {
    case 'topic':
      return FileText;
    case 'intent':
      return Users;
    case 'structure':
      return LayoutTemplate;
    case 'ymyl':
      return AlertTriangle;
    case 'tone':
      return Palette;
    case 'visual':
      return Image;
    case 'outline':
      return LayoutList;
    default:
      return FileText;
  }
}

export default function ResearchPhaseButton({
  phase,
  label,
  isActive,
  isComplete,
  isLoading,
  onClick,
  disabled = false,
}: ResearchPhaseButtonProps) {
  const Icon = getPhaseIcon(phase);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
        ${
          isActive
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div className={`p-2 rounded-lg ${
        isActive ? 'bg-zinc-700' : 'bg-zinc-800'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <span className="flex-1 text-left">{label}</span>
      
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      ) : isComplete ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      ) : null}
    </button>
  );
}