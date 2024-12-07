import React, { useState } from 'react';
import { useOpenAI } from '../../context/OpenAIContext';
import { Bot, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import ModelSelector from './ModelSelector';
import ToolsPanel from './ToolsPanel';
import ParametersPanel from './ParametersPanel';
import InstructionsPanel from './InstructionsPanel';
import NameEditor from './NameEditor';
import ConfirmDialog from '../ui/ConfirmDialog';

interface AssistantChanges {
  name?: string;
  model?: string;
  instructions?: string;
  tools?: Array<{ type: string }>;
  temperature?: number;
  topP?: number;
}

export default function AssistantSettings() {
  const { state, updateAssistant } = useOpenAI();
  const assistant = state.selectedAssistant;
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<AssistantChanges>({});
  const [isModified, setIsModified] = useState(false);

  if (!assistant) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No assistant selected</p>
      </div>
    );
  }

  const handleNameChange = (name: string) => {
    setPendingChanges(prev => ({ ...prev, name }));
    setIsModified(true);
  };

  const handleModelChange = (model: string) => {
    setPendingChanges(prev => ({ ...prev, model }));
    setIsModified(true);
  };

  const handleInstructionsChange = (instructions: string) => {
    setPendingChanges(prev => ({ ...prev, instructions }));
    setIsModified(true);
  };

  const handleToolsChange = (tools: Array<{ type: string }>) => {
    setPendingChanges(prev => ({ ...prev, tools }));
    setIsModified(true);
  };

  const handleParametersChange = (params: { temperature: number; topP: number }) => {
    setPendingChanges(prev => ({ ...prev, ...params }));
    setIsModified(true);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateAssistant(assistant.id, pendingChanges);
      toast.success('Assistant settings updated successfully');
      setIsModified(false);
      setPendingChanges({});
    } catch (error) {
      toast.error('Failed to update assistant', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsUpdating(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Update Button */}
      <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {pendingChanges.name || assistant.name || 'Unnamed Assistant'}
              </h2>
              <p className="text-sm text-zinc-400">
                ID: {assistant.id}
              </p>
            </div>
            <NameEditor 
              currentName={assistant.name || ''} 
              onSave={handleNameChange}
            />
          </div>
        </div>
        
        <button
          onClick={() => setShowConfirm(true)}
          disabled={!isModified || isUpdating}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium
            hover:bg-emerald-600 transition-colors disabled:opacity-50 
            disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isUpdating ? 'Updating...' : 'Update Assistant'}
        </button>
      </div>

      {/* Warning Banner */}
      {isModified && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg
          flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-200">
            You have unsaved changes. These modifications will affect this assistant across all
            applications where it's being used. Make sure to review your changes before updating.
          </p>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelSelector 
          currentModel={pendingChanges.model || assistant.model} 
          onModelChange={handleModelChange}
        />

        <ToolsPanel 
          tools={pendingChanges.tools || assistant.tools} 
          onToolsChange={handleToolsChange}
        />

        <ParametersPanel 
          temperature={pendingChanges.temperature ?? assistant.temperature ?? 0.7} 
          topP={pendingChanges.topP ?? assistant.top_p ?? 1}
          onParametersChange={handleParametersChange}
        />

        <InstructionsPanel 
          instructions={pendingChanges.instructions || assistant.instructions || ''} 
          onInstructionsChange={handleInstructionsChange}
        />
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleUpdate}
        title="Update Assistant Settings"
        description="Are you sure you want to update this assistant? These changes will affect all applications using this assistant, not just this one."
        confirmText="Yes, Update Assistant"
        cancelText="Cancel"
      />
    </div>
  );
}