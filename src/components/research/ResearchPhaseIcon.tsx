import React from 'react';
import { 
  BookOpen, 
  Users, 
  Search,
  FileInput,
  LayoutTemplate, 
  ShieldCheck, 
  MessageSquare, 
  Image, 
  FileText,
  FileEdit
} from 'lucide-react';
import type { ResearchPhase } from '../../types/research';

interface ResearchPhaseIconProps {
  phase: ResearchPhase;
  className?: string;
}

export default function ResearchPhaseIcon({ phase, className = '' }: ResearchPhaseIconProps) {
  switch (phase) {
    case 'topic':
      return <BookOpen className={className} />;
    case 'intent':
      return <Users className={className} />;
    case 'structure':
      return <LayoutTemplate className={className} />;
    case 'ymyl':
      return <ShieldCheck className={className} />;
    case 'tone':
      return <MessageSquare className={className} />;
    case 'visual':
      return <Image className={className} />;
    case 'keywords':
      return <Search className={className} />;
    case 'userContent':
      return <FileInput className={className} />;
    case 'outline':
      return <FileText className={className} />;
    case 'article':
      return <FileEdit className={className} />;
  }
}