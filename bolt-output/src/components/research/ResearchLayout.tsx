import React, { useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import type { ResearchPhase } from '@/../types/research';
import ResearchNavigation from '@/ResearchNavigation';
import ResearchContent from '@/ResearchContent';
import KeywordInput from '@/KeywordInput';
import { useOpenAI } from '@/../context/OpenAIContext';
import { toast } from 'sonner';
import { getAllPhases } from '@/../utils/research';

interface ResearchLayoutProps {
  onBack: () => void;
}

export default function ResearchLayout({ onBack }: ResearchLayoutProps) {
  const [activePhase, setActivePhase] = useState<ResearchPhase>('topic');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { startResearchPhase, state } = useOpenAI();
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [isResearching, setIsResearching] = useState(false);

  const runAllPhases = async (keyword: string) => {
    const phases = getAllPhases();
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
    <div className="fixed inset-0 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-zinc-800 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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

          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 top-[60px] overflow-hidden">
        <div className="h-full flex">
          {/* Sidebar */}
          <div className={`
            lg:w-80 w-full lg:relative absolute inset-y-0 left-0 z-20
            transform transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            bg-black lg:bg-transparent
          `}>
            <div className="h-full p-4 overflow-y-auto">
              <ResearchNavigation
                activePhase={activePhase}
                onPhaseChange={setActivePhase}
                currentKeyword={currentKeyword}
                isResearching={isResearching}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="lg:hidden mb-4">
                <h1 className="text-xl font-semibold text-white capitalize">
                  Content Research
                </h1>
              </div>

              <KeywordInput 
                onSubmit={handleKeywordSubmit} 
                isDisabled={isResearching}
              />
              
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-6">
                <ResearchContent 
                  phase={activePhase} 
                  keyword={currentKeyword}
                  isResearching={isResearching}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}