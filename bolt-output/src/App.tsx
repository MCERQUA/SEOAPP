import React from 'react';
import { Toaster } from 'sonner';
import { OpenAIProvider } from '@/context/OpenAIContext';
import { ProjectProvider } from '@/context/ProjectContext';
import AppRouter from '@/components/ui/AppRouter';

export default function App() {
  return (
    <OpenAIProvider>
      <ProjectProvider>
        <Toaster position="top-center" />
        <AppRouter />
      </ProjectProvider>
    </OpenAIProvider>
  );
}