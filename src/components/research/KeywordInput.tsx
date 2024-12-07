import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useOpenAI } from '../../context/OpenAIContext';
import { toast } from 'sonner';

interface KeywordInputProps {
  onSubmit: (keyword: string) => void;
  isDisabled?: boolean;
}

export default function KeywordInput({ onSubmit, isDisabled = false }: KeywordInputProps) {
  const [keyword, setKeyword] = useState('');
  const { state, updateUserContent } = useOpenAI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.userContent.isSubmitted) {
      toast.error('Please submit user content first', {
        description: 'Submit your content before starting research'
      });
      return;
    }

    if (keyword.trim() && !isDisabled) {
      updateUserContent({
        articleTitle: keyword.trim()
      });
      onSubmit(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Article Title"
          disabled={isDisabled || !state.userContent.isSubmitted}
          className="w-full px-4 py-2 pl-12 pr-24 bg-zinc-800 border border-zinc-700 
            rounded-lg text-white placeholder-zinc-500 
            focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
            outline-none transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-zinc-500" />
        </div>
        <button
          type="submit"
          disabled={!keyword.trim() || isDisabled || !state.userContent.isSubmitted}
          className="absolute inset-y-1 right-1 px-3 sm:px-4 bg-emerald-500 
            text-white rounded-md font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-emerald-600 transition-colors
            flex items-center gap-2"
        >
          {isDisabled ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Processing</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Begin Research</span>
              <span className="sm:hidden">Begin</span>
            </>
          )}
        </button>
      </div>
      {!state.userContent.isSubmitted && (
        <p className="absolute -bottom-6 left-0 text-sm text-yellow-500">
          Submit user content before starting research
        </p>
      )}
    </form>
  );
}