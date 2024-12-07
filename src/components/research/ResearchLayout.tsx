import React, { useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import type { ResearchPhase } from '../../types/research';
import ResearchNavigation from './ResearchNavigation';
import ResearchContent from './ResearchContent';
import KeywordInput from './KeywordInput';
import ArticleGeneration from '../article/ArticleGeneration';
import { useOpenAI } from '../../context/OpenAIContext';
import { toast } from 'sonner';
import { getAllPhases, getAutomatedPhases } from '../../utils/research';

interface ResearchLayoutProps {
  onBack: () => void;
}

const shouldShowKeywordInput = (phase: ResearchPhase): boolean => {
  return phase !== 'userContent' && phase !== 'article';
};

export default function ResearchLayout({ onBack }: ResearchLayoutProps) {
  const [activePhase, setActivePhase] = useState<ResearchPhase>('userContent');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { startResearchPhase, state } = useOpenAI();
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [isResearching, setIsResearching] = useState(false);

  const runAllPhases = async (keyword: string) => {
    const phases = getAutomatedPhases();
    let completedPhases = 0;

    for (const phase of phases) {
      try {
        await startResearchPhase(phase, keyword);
        completedPhases++;

        // Update progress
        toast.success(`Completed ${phase} analysis`, {
          description: `${completedPhases} of ${phases.length} phases complete`
        });
      } catch (error: any) {
        toast.error(`Error in ${phase} phase`, {
          description: error.message || 'An unexpected error occurred'
        });
        return false;
      }
    }
    
    // Start article generation after research is complete
    setActivePhase('article');
    return true;
  };

  const handleKeywordSubmit = async (keyword: string) => {
    if (!state.selectedAssistant) {
      toast.error('No assistant selected', {
        description: 'Please select an OpenAI assistant first'
      });
      return;
    }

    setCurrentKeyword(keyword);
    setIsResearching(true);

    try {
      await runAllPhases(keyword);
      toast.success('Research completed', {
        description: 'All phases have been analyzed'
      });
    } catch (error: any) {
      toast.error('Research process failed', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsResearching(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="fixed inset-0 bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Chat</span>
            </button>
            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />
            <h1 className="text-white font-medium capitalize hidden sm:block">
              Content Research
            </h1>
          </div>
          <div className="flex-1 max-w-xl mx-auto px-4">
            <KeywordInput 
              onSubmit={handleKeywordSubmit}
              isDisabled={isResearching}
            />
          </div>

          <button
            onClick={toggleSidebar}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 top-[57px] overflow-hidden">
        <div className="h-full flex">
          {/* Sidebar */}
          <div className={`
            w-20 lg:w-80 lg:relative fixed inset-y-0 left-0 z-20
            transform transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            bg-zinc-900 lg:bg-transparent
          `}>
            <div className="h-full p-4 overflow-y-auto scrollbar-custom">
              <ResearchNavigation
                activePhase={activePhase}
                onPhaseChange={setActivePhase}
                currentKeyword={currentKeyword}
                isResearching={isResearching}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto ml-20 lg:ml-0">
            <div className="p-4">
              <div className="lg:hidden mb-4">
                <h1 className="text-xl font-semibold text-white capitalize">
                  Research & Content Generation
                </h1>
              </div>

              
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-6">
                {activePhase === 'article' ? (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Article Generation</h2>
                    <ArticleGeneration />
                  </div>
                ) : (
                  <ResearchContent 
                    phase={activePhase} 
                    keyword={currentKeyword}
                    isResearching={isResearching}
                    onKeywordSubmit={handleKeywordSubmit} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}