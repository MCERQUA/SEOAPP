import React, { useState } from 'react';
import { Check, AlertTriangle, Plus, Minus, Undo2 } from 'lucide-react';
import { analyzePhaseContent } from '../../utils/contentAnalyzer';
import type { ResearchPhase } from '../../types/research';
import { toast } from 'sonner';

interface ResearchPhaseAnalysisProps {
  phase: ResearchPhase;
  researchContent: string;
  articleContent: string;
}

export default function ResearchPhaseAnalysis({ 
  phase, 
  researchContent, 
  articleContent 
}: ResearchPhaseAnalysisProps) {
  const analysis = analyzePhaseContent(phase, researchContent, articleContent);
  const [actionStates, setActionStates] = useState<Record<string, 'add' | 'remove' | null>>({});

  const handlePointAction = (point: string, implemented: boolean) => {
    setActionStates(prev => ({
      ...prev,
      [point]: implemented ? 'remove' : 'add'
    }));

    if (implemented) {
      toast.success('Point marked for removal', {
        description: 'This point will be removed in the next revision'
      });
    } else {
      toast.success('Point marked for inclusion', {
        description: 'This point will be added in the next revision'
      });
    }
  };

  const handleUndo = (point: string) => {
    setActionStates(prev => ({
      ...prev,
      [point]: null
    }));
    toast.success('Action undone', {
      description: 'The change has been reverted'
    });
  };

  return (
    <div className="mt-6 space-y-4">
      {analysis.items.map((item, index) => {
        const actionState = actionStates[item.point];
        const showAddState = !item.implemented && actionState === 'add';
        const showRemoveState = item.implemented && actionState === 'remove';
        const showAction = showAddState || showRemoveState;

        return (
          <div 
            key={index}
            className="flex items-start gap-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700 group relative"
          >
            {/* Status Icon */}
            {item.implemented ? (
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
            )}
            
            {/* Content */}
            <div className="space-y-2 flex-1">
              <p className="text-white">{item.point}</p>
              {!item.implemented && (
                <p className="text-sm text-zinc-400">
                  This research point could enhance your content
                </p>
              )}
            </div>

            {/* Action States */}
            {showAction && (
              <div className={`absolute right-24 top-1/2 -translate-y-1/2 px-3 py-1 rounded text-sm
                ${showAddState ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                {showAddState ? 'Added' : 'Removed'}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {showAction && (
                <button
                  onClick={() => handleUndo(item.point)}
                  className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100
                    bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                  title="Undo action"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => handlePointAction(item.point, item.implemented)}
                className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100
                  ${item.implemented ? 
                    'bg-red-500/10 hover:bg-red-500/20 text-red-500' : 
                    'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500'}`}
              >
                {item.implemented ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}