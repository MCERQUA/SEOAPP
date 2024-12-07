import React, { useState } from 'react';
import { Cpu, ChevronDown, Search, Loader2 } from 'lucide-react';
import { useModels } from '../../hooks/useModels';
import { useOpenAI } from '../../context/OpenAIContext';
import ModelGroup from './ModelGroup';

interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (model: string) => void;
}

export default function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
  const { state } = useOpenAI();
  const { models, isLoading } = useModels(state.apiKey);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentModelData = models.find(m => m.id === currentModel);

  // Filter and group models
  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recommendedModels = filteredModels.filter(m => m.category === 'recommended');
  const otherModels = filteredModels.filter(m => m.category !== 'recommended');

  if (isLoading) {
    return (
      <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <Cpu className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-white">Model Selection</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-zinc-800 rounded-lg">
          <Cpu className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-white">Model Selection</h3>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg
            flex items-center justify-between text-white hover:border-zinc-600 transition-all"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-zinc-400" />
            <div className="text-left">
              <div className="font-medium">
                {currentModelData?.name || currentModel}
              </div>
              <div className="text-sm text-zinc-400">
                {currentModelData?.description || 'Select a model'}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform
            ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-zinc-800 border border-zinc-700 
            rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 border-b border-zinc-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search models..."
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg
                    text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {/* Recommended Models */}
              <ModelGroup
                title="Recommended Models"
                models={recommendedModels}
                currentModel={currentModel}
                onModelSelect={(id) => {
                  onModelChange(id);
                  setIsOpen(false);
                }}
                variant="recommended"
              >
                <div className="px-4 py-2 text-sm text-emerald-500/80">
                  Latest and most efficient models for optimal performance
                </div>
              </ModelGroup>

              {/* Other Models */}
              <ModelGroup
                title="Not Recommended"
                models={otherModels}
                currentModel={currentModel}
                onModelSelect={(id) => {
                  onModelChange(id);
                  setIsOpen(false);
                }}
                variant="not-recommended"
              >
                <div className="px-4 py-2 text-sm text-red-500/80">
                  Legacy models with higher costs or limited capabilities
                </div>
              </ModelGroup>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}