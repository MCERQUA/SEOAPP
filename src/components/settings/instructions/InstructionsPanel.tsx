import React from 'react';
import { FileText, AlertCircle, RefreshCw } from 'lucide-react';
import InstructionsEditor from './InstructionsEditor';
import InstructionsPreview from './InstructionsPreview';
import { useInstructions } from './useInstructions';

export default function InstructionsPanel({ 
  instructions: initialInstructions, 
  onInstructionsChange 
}: {
  instructions: string | null;
  onInstructionsChange: (instructions: string) => void;
}) {
  const { 
    value, 
    isLoading,
    error, 
    handleChange,
    retry
  } = useInstructions(initialInstructions, onInstructionsChange);

  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <FileText className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-white">System Instructions</h3>
        </div>

        {error && (
          <button
            onClick={retry}
            className="flex items-center gap-2 px-3 py-1.5 text-sm
              bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white
              rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg
          flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {isLoading ? (
        <InstructionsPreview />
      ) : (
        <InstructionsEditor 
          value={value} 
          onChange={handleChange} 
        />
      )}
    </div>
  );
}