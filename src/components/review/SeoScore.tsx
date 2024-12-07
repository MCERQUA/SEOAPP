import React, { useMemo } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { calculateContentScore } from '../../utils/contentAnalyzer';
import type { ResearchState } from '../../types/research';

interface ResearchKnowledgeProps {
  researchData: ResearchState;
  articleContent: string;
}

export default function ResearchKnowledge({ researchData, articleContent }: ResearchKnowledgeProps) {
  const score = useMemo(() => 
    calculateContentScore(researchData, articleContent),
    [researchData, articleContent]
  );

  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
      <h2 className="text-xl font-semibold text-white mb-6">Research Knowledge Used</h2>
      
      <div className="w-48 h-48 mx-auto mb-6">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            rotation: 0.25,
            strokeLinecap: 'round',
            textSize: '16px',
            pathTransitionDuration: 0.5,
            pathColor: `rgb(16, 185, 129)`,
            textColor: '#fff',
            trailColor: '#27272a',
            backgroundColor: '#3f3f46',
          })}
        />
      </div>

      <div className="text-center">
        <p className="text-zinc-400 text-sm">
          {score >= 80 ? 'Excellent research implementation!' :
           score >= 60 ? 'Good coverage, consider adding more insights' :
           'More research points could be incorporated'}
        </p>
      </div>
    </div>
  );
}