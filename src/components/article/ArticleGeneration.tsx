import React, { useState } from 'react';
import { useOpenAI } from '../../context/OpenAIContext';
import ArticlePreview from './ArticlePreview';
import GenerationProgress from './GenerationProgress';
import GenerationControls from './GenerationControls';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateArticle } from '../../utils/articleGenerator';

export default function ArticleGeneration() {
  const { state, generateArticle: updateArticleState } = useOpenAI();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentPhase('Analyzing research data');

    try {
      await simulatePhase('Synthesizing research findings', 20);
      await simulatePhase('Generating content structure', 40);
      await simulatePhase('Writing main content', 60);
      await simulatePhase('Optimizing for SEO', 80);
      await simulatePhase('Finalizing article', 100);
      
      const content = await generateArticle(state.researchThreads);
      await updateArticleState(content);
      
      toast.success('Article generated successfully');
      setIsGenerating(false);
    } catch (error) {
      toast.error('Failed to generate article', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      setIsGenerating(false);
    }
  };

  const simulatePhase = async (phase: string, targetProgress: number) => {
    setCurrentPhase(phase);
    const increment = (targetProgress - progress) / 10;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(prev => Math.min(prev + increment, targetProgress));
    }
  };

  if (!state.researchThreads.outline?.completed) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">
          Complete all research phases to generate your article
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Article Generation</h2>
        <GenerationControls
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      {isGenerating && (
        <GenerationProgress
          phase={currentPhase}
          progress={progress}
        />
      )}

      {state.articleGeneration.content && (
        <ArticlePreview content={state.articleGeneration.content} />
      )}
    </div>
  );
}