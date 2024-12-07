import React from 'react';
import { useOpenAI } from '../context/OpenAIContext';

export default function AccountInfo() {
  const { state: openAIState } = useOpenAI();

  return (
    <div className="space-y-6 mb-6">
      <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-lg font-medium text-white mb-4">OpenAI Connection</h3>
        <div className="space-y-2">
          <p className="text-zinc-300">
            <span className="text-zinc-500">Status:</span>{' '}
            <span className="text-emerald-400">Connected</span>
          </p>
          <p className="text-zinc-300">
            <span className="text-zinc-500">Selected Assistant:</span>{' '}
            {openAIState.selectedAssistant?.name || 'None'}
          </p>
          <p className="text-zinc-300">
            <span className="text-zinc-500">Assistant ID:</span>{' '}
            <span className="font-mono text-sm">{openAIState.selectedAssistant?.id || 'None'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}