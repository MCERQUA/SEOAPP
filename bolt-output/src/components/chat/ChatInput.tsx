import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useOpenAI } from '@/../context/OpenAIContext';
import { toast } from 'sonner';

export default function ChatInput() {
  const { state, sendMessage } = useOpenAI();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || state.isLoading) return;

    try {
      await sendMessage(message.trim());
      setMessage('');
    } catch (error: any) {
      toast.error('Failed to send message', {
        description: error.message
      });
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg 
              focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none 
              text-white placeholder-zinc-500 pr-12"
            disabled={state.isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || state.isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 
              text-zinc-400 hover:text-white disabled:opacity-50 
              disabled:cursor-not-allowed rounded-lg hover:bg-zinc-700 transition-colors"
          >
            {state.isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}