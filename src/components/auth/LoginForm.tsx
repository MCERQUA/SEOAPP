import React, { useState } from 'react';
import { Key, Loader2, Check, AlertCircle, ExternalLink, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useOpenAI } from '../../context/OpenAIContext';
import type { Assistant } from 'openai/resources/beta/assistants/assistants';
import MouseGlow from '../effects/MouseGlow';

const AnimatedLetter = ({ letter, color = 'text-white' }: { letter: string; color?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={`inline-block px-0.5 transition-all duration-300 ease-out ${color}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(2.5)' : 'scale(1)',
        transformOrigin: 'center center',
        position: 'relative',
        zIndex: isHovered ? 10 : 1,
      }}
    >
      <span className="relative z-10">{letter}</span>
      <span 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.4) 50%, rgba(236, 72, 153, 0.4) 100%)',
          filter: 'blur(8px)',
          transform: 'scale(2)',
          animation: isHovered ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
        }}
      />
    </span>
  );
};

const AnimatedTitle = ({ text, color }: { text: string; color?: string }) => (
  <div className="flex justify-center gap-0.5 flex-wrap">
    {text.split('').map((letter, index) => (
      <AnimatedLetter 
        key={index} 
        letter={letter} 
        color={color === 'red' ? 'text-red-500' : color} 
      />
    ))}
  </div>
);

export default function LoginForm() {
  const { state, connect, selectAssistant, proceedToChat } = useOpenAI();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAssistantDropdownOpen, setIsAssistantDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await connect(apiKey);
      toast.success('Successfully connected to OpenAI');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to connect. Please check your API key.';
      setError(errorMessage);
      toast.error('Connection failed', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssistantSelect = (assistant: Assistant) => {
    selectAssistant(assistant);
    setIsAssistantDropdownOpen(false);
    toast.success('Assistant selected', {
      description: `Now using ${assistant.name || 'Unnamed Assistant'}`
    });
  };

  const handleGetApiKey = () => {
    window.open('https://platform.openai.com/api-keys', '_blank');
  };

  const handleCreateAssistant = () => {
    window.open('https://platform.openai.com/assistants', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 overflow-hidden">
      <MouseGlow />
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <AnimatedTitle text="SEO" color="red" />
              <AnimatedTitle text="AI" />
              <AnimatedTitle text="CONTENT" />
            </div>
            <div className="flex items-center gap-2">
              <AnimatedTitle text="GENERATOR" />
            </div>
          </h1>
        </div>

        <div className="p-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
          {/* Rest of the LoginForm component remains exactly the same */}
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Key className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white">Connect to OpenAI</h2>
            <p className="text-zinc-400 text-sm">
              Enter your OpenAI API key to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="apiKey" className="text-sm font-medium text-zinc-200 block">
                  API Key
                </label>
                <button
                  type="button"
                  onClick={handleGetApiKey}
                  className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Get API Key
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg 
                    focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none 
                    text-white placeholder-zinc-500 transition-all
                    group-hover:border-zinc-600
                    ${state.isConnected ? 'border-emerald-500/50 opacity-75' : 'border-zinc-700'}`}
                  placeholder="sk-..."
                  required
                  disabled={state.isConnected}
                  autoComplete="current-password"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {state.isConnected ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : error ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : null}
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              )}
            </div>

            {!state.isConnected && (
              <button
                type="submit"
                disabled={isLoading || !apiKey}
                className="w-full py-2.5 px-4 rounded-lg font-medium transition-all
                  flex items-center justify-center gap-2
                  bg-emerald-500 hover:bg-emerald-600 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            )}
          </form>

          {state.isConnected && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200 block">
                  Select Assistant
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsAssistantDropdownOpen(!isAssistantDropdownOpen)}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                      flex items-center justify-between text-left
                      hover:border-zinc-600 transition-all"
                  >
                    <span className="text-zinc-300">
                      {state.selectedAssistant?.name || 'Select an assistant...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${
                      isAssistantDropdownOpen ? 'transform rotate-180' : ''
                    }`} />
                  </button>
                  
                  {isAssistantDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl
                      max-h-48 overflow-y-auto overscroll-contain">
                      {state.assistants.map((assistant) => (
                        <button
                          key={assistant.id}
                          onClick={() => handleAssistantSelect(assistant)}
                          className="w-full px-4 py-2 text-left hover:bg-zinc-700 text-zinc-300
                            flex items-center gap-2 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center">
                            <Key className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {assistant.name || 'Unnamed Assistant'}
                            </div>
                            {assistant.description && (
                              <div className="text-xs text-zinc-400 truncate">
                                {assistant.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateAssistant}
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium
                    bg-zinc-800 hover:bg-zinc-700
                    text-zinc-300 hover:text-white
                    transition-all flex items-center justify-center gap-2
                    border border-zinc-700 hover:border-zinc-600"
                >
                  Create New
                </button>

                <button
                  onClick={proceedToChat}
                  disabled={!state.selectedAssistant}
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium
                    bg-emerald-500 hover:bg-emerald-600
                    text-white transition-all
                    flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg shadow-emerald-500/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-zinc-500 text-center">
              Your API key is stored locally and never sent to our servers
            </p>
            <p className="text-xs text-zinc-500 text-center">
              Click "Get API Key" to create a key on OpenAI's website. Your browser can securely save the key for future sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}