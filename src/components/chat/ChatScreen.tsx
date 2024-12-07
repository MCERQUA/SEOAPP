import React, { useState } from 'react';
import { useOpenAI } from '../../context/OpenAIContext';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import MenuBar from '../MenuBar';
import ProgressBar from '../ProgressBar';
import AccountPage from '../pages/AccountPage';
import ResearchLayout from '../research/ResearchLayout';
import DraftReview from '../review/DraftReview';

export default function ChatScreen() {
  const { state, goBack } = useOpenAI();
  const [showAccount, setShowAccount] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [showDraftReview, setShowDraftReview] = useState(false);
  const assistant = state.selectedAssistant!;

  if (showAccount) {
    return <AccountPage onBack={() => setShowAccount(false)} />;
  }

  if (showResearch) {
    return <ResearchLayout onBack={() => setShowResearch(false)} />;
  }

  if (showDraftReview) {
    return <DraftReview onBack={() => setShowDraftReview(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <MenuBar 
        onAccountClick={() => setShowAccount(true)}
        onResearchClick={() => setShowResearch(true)}
        onDraftReviewClick={() => setShowDraftReview(true)}
      />
      <div className="flex-1 flex flex-col mt-16">
        <ChatHeader assistant={assistant} onBack={goBack} />
        <div className="flex-1 relative flex flex-col min-h-0">
          <div className="absolute inset-0 flex flex-col">
            <ChatMessages />
            <div className="sticky bottom-0 left-0 right-0 z-10">
              <ChatInput />
              <ProgressBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}