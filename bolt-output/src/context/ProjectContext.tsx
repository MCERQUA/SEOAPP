import React, { createContext, useContext, useState } from 'react';
import type { ProjectState, ProjectData } from '@/types/project';

interface ProjectContextType {
  state: ProjectState;
  openQuestionModal: () => void;
  closeQuestionModal: () => void;
  updateProjectData: (data: Partial<ProjectData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const initialProjectData: ProjectData = {
  targetKeyword: '',
  companyInfo: {
    name: '',
    phone: '',
    address: '',
  },
  websiteInfo: {
    domain: '',
    blogUrl: '',
  },
  locations: [],
};

const initialState: ProjectState = {
  isQuestionModalOpen: false,
  currentStep: 0,
  projectData: initialProjectData,
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProjectState>(initialState);

  const openQuestionModal = () => {
    setState(prev => ({ ...prev, isQuestionModalOpen: true }));
  };

  const closeQuestionModal = () => {
    setState(prev => ({ ...prev, isQuestionModalOpen: false, currentStep: 0 }));
  };

  const updateProjectData = (data: Partial<ProjectData>) => {
    setState(prev => ({
      ...prev,
      projectData: { ...prev.projectData, ...data },
    }));
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  };

  return (
    <ProjectContext.Provider value={{
      state,
      openQuestionModal,
      closeQuestionModal,
      updateProjectData,
      nextStep,
      prevStep,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}