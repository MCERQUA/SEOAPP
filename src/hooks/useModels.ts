import { useState, useEffect } from 'react';
import OpenAI from 'openai';

interface Model {
  id: string;
  name: string;
  description: string;
  category: 'recommended' | 'legacy' | 'other';
  capabilities: string[];
  costEfficiency: 'high' | 'medium' | 'low';
}

const MODEL_DESCRIPTIONS: Record<string, { 
  name: string, 
  capabilities: string[], 
  category: 'recommended' | 'legacy' | 'other',
  costEfficiency: 'high' | 'medium' | 'low'
}> = {
  'gpt-4o': {
    name: 'GPT-4 Optimized',
    capabilities: [
      'Optimized for long-form content',
      'Enhanced article generation',
      'Advanced semantic understanding',
      'Improved coherence and flow'
    ],
    category: 'recommended',
    costEfficiency: 'high'
  },
  'gpt-4o-mini': {
    name: 'GPT-4 Optimized Mini',
    capabilities: [
      'Efficient for shorter content',
      'Quick research analysis',
      'Rapid content optimization',
      'Resource-efficient processing'
    ],
    category: 'recommended',
    costEfficiency: 'high'
  },
  'gpt-4-turbo-preview': {
    name: 'GPT-4 Turbo Preview',
    capabilities: [
      'Legacy model',
      'Not optimized for content generation',
      'Higher latency',
      'Not recommended for this application'
    ],
    category: 'legacy',
    costEfficiency: 'low'
  },
  'gpt-4': {
    name: 'GPT-4',
    capabilities: [
      'Legacy model',
      'Not optimized for content',
      'Higher cost',
      'Not recommended for new projects'
    ],
    category: 'legacy',
    costEfficiency: 'low'
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    capabilities: [
      'Basic capabilities only',
      'Limited content understanding',
      'Not suitable for professional content',
      'Insufficient for SEO optimization'
    ],
    category: 'other',
    costEfficiency: 'medium'
  }
};

export function useModels(apiKey: string | null) {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) return;

    const fetchModels = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const openai = new OpenAI({ 
          apiKey,
          dangerouslyAllowBrowser: true
        });

        const response = await openai.models.list();
        
        // Process and categorize models
        const processedModels = response.data
          .filter(model => {
            // Filter for our specific models
            return model.id.startsWith('gpt-');
          })
          .map(model => {
            const modelInfo = MODEL_DESCRIPTIONS[model.id] || {
              name: model.id,
              capabilities: ['General purpose model'],
              category: 'other',
              costEfficiency: 'medium'
            };

            return {
              id: model.id,
              name: modelInfo.name,
              description: modelInfo.capabilities.join(' • '),
              category: modelInfo.category,
              capabilities: modelInfo.capabilities,
              costEfficiency: modelInfo.costEfficiency
            } as Model;
          })
          .sort((a, b) => {
            // Sort recommended models first
            if (a.category === 'recommended' && b.category !== 'recommended') return -1;
            if (a.category !== 'recommended' && b.category === 'recommended') return 1;
            
            // Then by cost efficiency
            const costOrder = { high: 0, medium: 1, low: 2 };
            return costOrder[a.costEfficiency] - costOrder[b.costEfficiency];
          });

        // Add warning messages for non-recommended models
        const modelsWithWarnings = processedModels.map(model => ({
          ...model,
          description: model.category !== 'recommended' 
            ? `⚠️ Not recommended for this application • ${model.description}`
            : model.description
        }));

        setModels(modelsWithWarnings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch models');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [apiKey]);

  return { models, isLoading, error };
}