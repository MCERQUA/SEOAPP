import React from 'react';

export default function ProgressBar() {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800 px-4 py-1.5">
      <div className="max-w-4xl mx-auto">
        <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
          <span className="animate-pulse">●</span>
          <span>Processing request... Analyzing code patterns and generating optimizations</span>
        </div>
      </div>
    </div>
  );
}