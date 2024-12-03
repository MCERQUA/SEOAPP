import React from 'react';
import { Loader2 } from 'lucide-react';

export default function InstructionsPreview() {
  return (
    <div className="flex items-center justify-center h-48 bg-zinc-800 rounded-lg border border-zinc-700">
      <div className="flex items-center gap-2 text-zinc-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading instructions...</span>
      </div>
    </div>
  );
}