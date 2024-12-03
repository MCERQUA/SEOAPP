import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useOpenAI } from '../../context/OpenAIContext';
import { createOpenAIClient } from '../../utils/openai-client';

interface InstructionsPanelProps {
  instructions: string | null;
  onInstructionsChange: (instructions: string) => void;
}

export default function InstructionsPanel({ 
  instructions: initialInstructions, 
  onInstructionsChange 
}: InstructionsPanelProps) {
  const { state } = useOpenAI();
  const [value, setValue] = React.useState(initialInstructions || '');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInstructions = async () => {
      if (!state.selectedAssistant?.id || !state.apiKey) {
        setIsLoading(false);
        return;
      }

      try {
        const openai = createOpenAIClient(state.apiKey);
        const assistant = await openai.beta.assistants.retrieve(
          state.selectedAssistant.id
        );

        if (assistant.instructions) {
          setValue(assistant.instructions);
          onInstructionsChange(assistant.instructions);
        }
      } catch (error) {
        console.error('Failed to fetch assistant instructions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructions();
  }, [state.selectedAssistant?.id, state.apiKey, onInstructionsChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onInstructionsChange(e.target.value);
  };

  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-zinc-800 rounded-lg">
          <FileText className="w-5 h-5 text-orange-500" />
        </div>
        <h3 className="text-lg font-medium text-white">System Instructions</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 bg-zinc-800 rounded-lg border border-zinc-700">
          <div className="flex items-center gap-2 text-zinc-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading instructions...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={value}
            onChange={handleChange}
            placeholder="Enter system instructions for the assistant..."
            className="w-full h-48 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg
              text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500/50 
              focus:border-orange-500/50 outline-none resize-none font-mono text-sm"
          />
          <p className="text-xs text-zinc-500">
            Maximum length: 32,768 characters
          </p>
        </div>
      )}
    </div>
  );
}