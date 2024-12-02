import React, { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useOpenAI } from '@/../context/OpenAIContext';
import AssistantCard from '@/AssistantCard';
import AssistantActions from '@/AssistantActions';

export default function AssistantsList() {
  const { state, selectAssistant } = useOpenAI();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (assistantId: string) => {
    setSelectedId(assistantId);
    const assistant = state.assistants.find(a => a.id === assistantId);
    if (assistant) {
      selectAssistant(assistant);
      toast.success('Assistant selected', {
        description: `Now chatting with ${assistant.name || 'Unnamed Assistant'}`
      });
    }
  };

  if (!state.assistants.length) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg mx-auto flex items-center justify-center">
          <Bot className="w-6 h-6 text-zinc-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">No Assistants Found</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Create an assistant in your OpenAI dashboard to get started
          </p>
        </div>
        <AssistantActions />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-white">
          Select an Assistant
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Choose an assistant to start chatting
        </p>
      </div>

      <div className="space-y-3">
        {state.assistants.map((assistant) => (
          <AssistantCard
            key={assistant.id}
            assistant={assistant}
            isSelected={selectedId === assistant.id}
            onClick={() => handleSelect(assistant.id)}
          />
        ))}
      </div>

      <AssistantActions />
    </div>
  );
}