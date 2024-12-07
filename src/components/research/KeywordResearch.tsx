import React, { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';

interface KeywordList {
  id: string;
  text: string;
}

interface KeywordSectionProps {
  title: string;
  items: KeywordList[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  placeholder?: string;
}

function KeywordSection({ title, items, onAdd, onRemove, placeholder }: KeywordSectionProps) {
  const [newKeyword, setNewKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      onAdd(newKeyword.trim());
      setNewKeyword('');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder={placeholder || "Add new keyword..."}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
            focus:border-transparent outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!newKeyword.trim()}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium
            hover:bg-emerald-600 transition-colors disabled:opacity-50 
            disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg
              border border-zinc-700 group"
          >
            <span className="flex-1 text-zinc-300">{item.text}</span>
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 text-zinc-500 hover:text-white rounded
                opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KeywordResearch() {
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState<KeywordList[]>([]);
  const [lsiKeywords, setLsiKeywords] = useState<KeywordList[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<KeywordList[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordList[]>([]);
  const [competitorKeywords, setCompetitorKeywords] = useState<KeywordList[]>([]);

  const addKeyword = (
    setter: React.Dispatch<React.SetStateAction<KeywordList[]>>,
    text: string
  ) => {
    setter(prev => [...prev, { id: Date.now().toString(), text }]);
  };

  const removeKeyword = (
    setter: React.Dispatch<React.SetStateAction<KeywordList[]>>,
    id: string
  ) => {
    setter(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Primary Keyword */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Primary Keyword</h3>
        <input
          type="text"
          value={primaryKeyword}
          onChange={(e) => setPrimaryKeyword(e.target.value)}
          placeholder="Enter primary keyword..."
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
            focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Secondary Keywords */}
      <KeywordSection
        title="Secondary Keywords"
        items={secondaryKeywords}
        onAdd={(text) => addKeyword(setSecondaryKeywords, text)}
        onRemove={(id) => removeKeyword(setSecondaryKeywords, id)}
        placeholder="Add secondary keyword..."
      />

      {/* LSI Keywords */}
      <KeywordSection
        title="LSI Keywords"
        items={lsiKeywords}
        onAdd={(text) => addKeyword(setLsiKeywords, text)}
        onRemove={(id) => removeKeyword(setLsiKeywords, id)}
        placeholder="Add LSI keyword..."
      />

      {/* Related Questions */}
      <KeywordSection
        title="Related Questions"
        items={relatedQuestions}
        onAdd={(text) => addKeyword(setRelatedQuestions, text)}
        onRemove={(id) => removeKeyword(setRelatedQuestions, id)}
        placeholder="Add related question..."
      />

      {/* Long-tail Keywords */}
      <KeywordSection
        title="Long-tail Keywords"
        items={longTailKeywords}
        onAdd={(text) => addKeyword(setLongTailKeywords, text)}
        onRemove={(id) => removeKeyword(setLongTailKeywords, id)}
        placeholder="Add long-tail keyword..."
      />

      {/* Competitor Keywords */}
      <KeywordSection
        title="Competitor Keywords"
        items={competitorKeywords}
        onAdd={(text) => addKeyword(setCompetitorKeywords, text)}
        onRemove={(id) => removeKeyword(setCompetitorKeywords, id)}
        placeholder="Add competitor keyword..."
      />
    </div>
  );
}