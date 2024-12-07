import React from 'react';
import { ArrowLeft, Bot } from 'lucide-react';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';

interface ChatHeaderProps {
  assistant: Assistant;
  onBack: () => void;
}

export default function ChatHeader({ assistant, onBack }: ChatHeaderProps) {
  return (
    <div className="border-b border-zinc-800 bg-zinc-900 py-3 px-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <Bot className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-medium text-white truncate">
              {assistant.name || 'Unnamed Assistant'}
            </h1>
            <p className="text-xs text-zinc-400 truncate mt-0.5">
              Assistant ID: {assistant.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}