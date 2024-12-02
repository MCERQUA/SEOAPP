import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface KeywordInputProps {
  onSubmit: (keyword: string) => void;
  isDisabled?: boolean;
}

export default function KeywordInput({ onSubmit, isDisabled = false }: KeywordInputProps) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim() && !isDisabled) {
      onSubmit(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter target keyword or phrase..."
          disabled={isDisabled}
          className="w-full px-4 py-3 pl-12 bg-zinc-800 border border-zinc-700 
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
          disabled={!keyword.trim() || isDisabled}
          className="absolute inset-y-2 right-2 px-4 bg-emerald-500 
            text-white rounded-md font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-emerald-600 transition-colors
            flex items-center gap-2"
        >
          {isDisabled ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing</span>
            </>
          ) : (
            'Begin Research'
          )}
        </button>
      </div>
    </form>
  );
}