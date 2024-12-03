import React from 'react';
import { Search, FileText, ListTodo, LayoutList, User } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import QuestionModal from '@/modals/QuestionModal';

interface MenuBarProps {
  onAccountClick: () => void;
  onResearchClick: () => void;
}

export default function MenuBar({ onAccountClick, onResearchClick }: MenuBarProps) {
  const { openQuestionModal } = useProject();

  const handleButtonClick = (action: string) => {
    if (action === 'start') {
      openQuestionModal();
    } else if (action === 'account') {
      onAccountClick();
    } else if (action === 'research') {
      onResearchClick();
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-zinc-800 px-4 py-2 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Start Button */}
          <button
            onClick={() => handleButtonClick('start')}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 
              rounded-lg shadow-lg border border-red-400 hover:border-red-300 
              text-white font-medium transition-all duration-200 
              hover:shadow-red-500/20 hover:scale-105 whitespace-nowrap"
          >
            Start
          </button>

          {/* Center Icon Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleButtonClick('research')}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 
                border border-zinc-700 hover:border-zinc-600 transition-all 
                flex items-center justify-center group"
              title="Research"
            >
              <Search className="w-5 h-5 text-zinc-400 group-hover:text-white" />
            </button>

            <button
              onClick={() => handleButtonClick('keywords')}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 
                border border-zinc-700 hover:border-zinc-600 transition-all 
                flex items-center justify-center group"
              title="Keywords"
            >
              <FileText className="w-5 h-5 text-zinc-400 group-hover:text-white" />
            </button>

            <button
              onClick={() => handleButtonClick('headings')}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 
                border border-zinc-700 hover:border-zinc-600 transition-all 
                flex items-center justify-center group"
              title="Headings"
            >
              <ListTodo className="w-5 h-5 text-zinc-400 group-hover:text-white" />
            </button>

            <button
              onClick={() => handleButtonClick('outline')}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 
                border border-zinc-700 hover:border-zinc-600 transition-all 
                flex items-center justify-center group"
              title="Outline"
            >
              <LayoutList className="w-5 h-5 text-zinc-400 group-hover:text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Account Button */}
            <button
              onClick={() => handleButtonClick('account')}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 
                border border-zinc-700 hover:border-zinc-600 transition-all 
                flex items-center justify-center group"
              title="Account Info"
            >
              <User className="w-5 h-5 text-zinc-400 group-hover:text-white" />
            </button>

            {/* Create Draft Button */}
            <button
              onClick={() => handleButtonClick('create-draft')}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 
                rounded-lg shadow-lg border border-emerald-400 hover:border-emerald-300 
                text-white font-medium transition-all duration-200 
                hover:shadow-emerald-500/20 hover:scale-105 whitespace-nowrap"
            >
              Create Draft
            </button>
          </div>
        </div>
      </div>

      <QuestionModal />
    </>
  );
}