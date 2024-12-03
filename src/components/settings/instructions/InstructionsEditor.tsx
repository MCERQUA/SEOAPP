import React from 'react';

interface InstructionsEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InstructionsEditor({ value, onChange }: InstructionsEditorProps) {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter system instructions for the assistant..."
        className="w-full h-48 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg
          text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500/50 
          focus:border-orange-500/50 outline-none resize-none font-mono text-sm"
      />
      <p className="text-xs text-zinc-500">
        Maximum length: 32,768 characters
      </p>
    </div>
  );
}