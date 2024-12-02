import React from 'react';
import { ArrowLeft } from 'lucide-react';
import AccountInfo from '../AccountInfo';

interface AccountPageProps {
  onBack: () => void;
}

export default function AccountPage({ onBack }: AccountPageProps) {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-zinc-800 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Chat</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="absolute inset-0 top-[60px] overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
          <h1 className="text-2xl font-bold text-white mb-6">Account Information</h1>
          <AccountInfo />
        </div>
      </div>
    </div>
  );
}