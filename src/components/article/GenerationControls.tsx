import React from 'react';
import { Play, Loader2 } from 'lucide-react';

interface GenerationControlsProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function GenerationControls({ onGenerate, isGenerating }: GenerationControlsProps) {
  return (
    <button
      onClick={onGenerate}
      disabled={isGenerating}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white 
        rounded-lg hover:bg-emerald-600 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          <span>Generate Article</span>
        </>
      )}
    </button>
  );
}