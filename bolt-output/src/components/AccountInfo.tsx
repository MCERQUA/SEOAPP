import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { useOpenAI } from '@/context/OpenAIContext';

export default function AccountInfo() {
  const { state: projectState } = useProject();
  const { state: openAIState } = useOpenAI();

  return (
    <div className="space-y-6 mb-6">
      <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-lg font-medium text-white mb-4">Project Information</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-1">Target Keyword</h4>
            <p className="text-zinc-300">{projectState.projectData.targetKeyword || 'Not set'}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-1">Company Information</h4>
            <div className="space-y-2">
              <p className="text-zinc-300">
                <span className="text-zinc-500">Name:</span> {projectState.projectData.companyInfo.name || 'Not set'}
              </p>
              <p className="text-zinc-300">
                <span className="text-zinc-500">Phone:</span> {projectState.projectData.companyInfo.phone || 'Not set'}
              </p>
              <p className="text-zinc-300">
                <span className="text-zinc-500">Address:</span> {projectState.projectData.companyInfo.address || 'Not set'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-1">Website Information</h4>
            <div className="space-y-2">
              <p className="text-zinc-300">
                <span className="text-zinc-500">Domain:</span>{' '}
                <a
                  href={projectState.projectData.websiteInfo.domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  {projectState.projectData.websiteInfo.domain || 'Not set'}
                </a>
              </p>
              <p className="text-zinc-300">
                <span className="text-zinc-500">Blog URL:</span>{' '}
                <a
                  href={projectState.projectData.websiteInfo.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  {projectState.projectData.websiteInfo.blogUrl || 'Not set'}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-1">Target Locations</h4>
            {projectState.projectData.locations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {projectState.projectData.locations.map((location, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300"
                  >
                    {location}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No locations set</p>
            )}
          </div>
        </div>
      </div>

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