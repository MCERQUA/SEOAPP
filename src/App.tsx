import React from 'react';
import { Toaster } from 'sonner';
import { OpenAIProvider } from './context/OpenAIContext';
import AppRouter from './components/AppRouter';

export default function App() {
  return (
    <OpenAIProvider>
      <Toaster position="top-center" />
      <AppRouter />
    </OpenAIProvider>
  );
}