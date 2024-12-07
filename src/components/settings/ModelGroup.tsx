import React from 'react';
import { CheckCircle2, Zap, AlertTriangle } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  description: string;
  category: 'recommended' | 'legacy' | 'other';
  costEfficiency: 'high' | 'medium' | 'low';
}

interface ModelGroupProps {
  title: string;
  models: Model[];
  currentModel: string;
  onModelSelect: (id: string) => void;
  variant: 'recommended' | 'not-recommended';
  children?: React.ReactNode;
}

export default function ModelGroup({
  title,
  models,
  currentModel,
  onModelSelect,
  variant,
  children
}: ModelGroupProps) {
  if (models.length === 0) return null;

  const getBgColor = (model: Model) => {
    if (variant === 'recommended') {
      return 'bg-emerald-500/5 hover:bg-emerald-500/10';
    }
    return 'bg-red-500/5 hover:bg-red-500/10';
  };

  const getBorderColor = (model: Model) => {
    if (variant === 'recommended') {
      return 'border-emerald-500/20';
    }
    return 'border-red-500/20';
  };

  const getModelLabel = (model: Model) => {
    if (model.id.includes('0125-preview')) {
      return 'Best for Articles';
    }
    if (model.id.includes('turbo-preview')) {
      return 'Best for Chat';
    }
    return null;
  };

  return (
    <div className="py-2 border-b border-zinc-700 last:border-0">
      <div className="px-4 py-2">
        <div className="flex items-center gap-2">
          {variant === 'recommended' ? (
            <Zap className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
          <h4 className="text-sm font-medium text-zinc-300">{title}</h4>
        </div>
        {children}
      </div>
      
      {models.map((model) => {
        const label = getModelLabel(model);
        
        return (
          <button
            key={model.id}
            onClick={() => onModelSelect(model.id)}
            className={`w-full px-4 py-3 flex items-center justify-between
              text-left transition-colors group border-y
              ${getBgColor(model)} ${getBorderColor(model)}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">
                  {model.name}
                </span>
                {label && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full 
                    ${variant === 'recommended' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {label}
                  </span>
                )}
              </div>
              <div className="text-sm text-zinc-400 mt-0.5">
                {model.description}
              </div>
            </div>
            {currentModel === model.id && (
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0
                ${variant === 'recommended' ? 'text-emerald-500' : 'text-zinc-400'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}