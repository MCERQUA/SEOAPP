import React from 'react';
import { Bot } from 'lucide-react';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';

interface AssistantCardProps {
  assistant: Assistant;
  isSelected: boolean;
  onClick: () => void;
}

export default function AssistantCard({ assistant, isSelected, onClick }: AssistantCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg transition-all
        ${
          isSelected
            ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
            : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700'
        }
        flex items-start gap-4 text-left`}
    >
      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-zinc-700'}`}>
        <Bot className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-zinc-400'}`} />
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {assistant.name || 'Unnamed Assistant'}
        </h3>
        {assistant.description && (
          <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">
            {assistant.description}
          </p>
        )}
      </div>
    </button>
  );
}