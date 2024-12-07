import React from 'react';
import { useOpenAI } from '@/context/OpenAIContext';
import LoginForm from '@/auth/LoginForm';
import ChatScreen from '@/chat/ChatScreen';

export default function AppRouter() {
  const { state } = useOpenAI();
  const showChat = state.isConnected && state.selectedAssistant && state.showChat;

  return showChat ? <ChatScreen /> : <LoginForm />;
}