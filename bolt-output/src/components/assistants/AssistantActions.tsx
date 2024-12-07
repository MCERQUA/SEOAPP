import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { useOpenAI } from '@/../context/OpenAIContext';

export default function AssistantActions() {
  const { state, proceedToChat } = useOpenAI();
  const hasSelectedAssistant = !!state.selectedAssistant;

  const handleCreateAssistant = () => {
    window.open('https://platform.openai.com/assistants', '_blank');
  };

  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={handleCreateAssistant}
        className="flex-1 py-2.5 px-4 rounded-lg font-medium
          bg-zinc-800 hover:bg-zinc-700
          text-zinc-300 hover:text-white
          transition-all flex items-center justify-center gap-2
          border border-zinc-700 hover:border-zinc-600"
      >
        <Plus className="w-4 h-4" />
        <span>Create Assistant</span>
      </button>

      <button
        onClick={proceedToChat}
        disabled={!hasSelectedAssistant}
        className="flex-1 py-2.5 px-4 rounded-lg font-medium
          bg-emerald-500 hover:bg-emerald-600
          text-white transition-all
          flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg shadow-emerald-500/20"
      >
        <span>Continue</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}