import React, { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { useOpenAI } from '@/../context/OpenAIContext';
import { formatMessage } from '@/../utils/messageFormatter';

export default function ChatMessages() {
  const { state } = useOpenAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  if (!state.messages.length) {
    return (
      <div className="flex-1 overflow-y-scroll scrollbar-custom flex items-center justify-center p-4">
        <div className="text-zinc-500 text-center">
          Start a conversation with your assistant
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-scroll scrollbar-custom bg-black"
    >
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {state.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === 'assistant' ? 'items-start' : 'items-start'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                message.role === 'assistant'
                  ? 'bg-zinc-800'
                  : 'bg-emerald-500'
              }`}
            >
              {message.role === 'assistant' ? (
                <Bot className="w-5 h-5 text-zinc-400" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessage(message.content)
                }}
              />
              <div className="text-xs text-zinc-500">
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {state.isLoading && (
          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg bg-zinc-800 shrink-0">
              <Bot className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="flex-1">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-zinc-700 rounded-full"></div>
                <div className="h-2 w-2 bg-zinc-700 rounded-full"></div>
                <div className="h-2 w-2 bg-zinc-700 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}