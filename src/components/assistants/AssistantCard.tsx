import React from 'react';
import { Bot } from 'lucide-react';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';

interface AssistantCardProps {
  assistant: Assistant;
  isSelected: boolean;
  onClick: () => void;
}

export default function AssistantCard({ assistant, isSelected, onClick }: AssistantCardProps) {
  // Check if the assistant is managed by our app by looking at the name or description
  const isManagedAssistant = assistant.name?.toLowerCase().includes('seo') || 
                            assistant.description?.toLowerCase().includes('seo content generator');

  // If it's our test assistant, modify the display name
  const displayName = assistant.name === 'app assistant test 1' 
    ? 'Modified by SEO AI Content Generator'
    : assistant.name || 'Unnamed Assistant';

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
      <div className={`p-2 rounded-lg ${
        isSelected 
          ? 'bg-blue-100 dark:bg-blue-800' 
          : isManagedAssistant
            ? 'bg-emerald-100 dark:bg-emerald-800/20'
            : 'bg-gray-100 dark:bg-zinc-700'
      }`}>
        <Bot className={`w-5 h-5 ${
          isSelected 
            ? 'text-blue-600 dark:text-blue-400'
            : isManagedAssistant
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-gray-600 dark:text-zinc-400'
        }`} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {displayName}
          </h3>
          {isManagedAssistant && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full 
              bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Modified
            </span>
          )}
        </div>
        {assistant.description && (
          <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">
            {assistant.description}
          </p>
        )}
      </div>
    </button>
  );
}