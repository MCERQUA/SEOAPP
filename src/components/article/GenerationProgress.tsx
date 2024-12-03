import React from 'react';
import { Loader2 } from 'lucide-react';

interface GenerationProgressProps {
  phase: string;
  progress: number;
}

export default function GenerationProgress({ phase, progress }: GenerationProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        <span className="text-zinc-300">{phase}</span>
      </div>

      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-zinc-500 text-right">
        {Math.round(progress)}% complete
      </p>
    </div>
  );
}