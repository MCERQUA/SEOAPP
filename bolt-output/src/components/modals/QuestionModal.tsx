import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useProject } from '@/../context/ProjectContext';
import { normalizeUrl } from '@/../utils/url';

export default function QuestionModal() {
  const { state, closeQuestionModal, updateProjectData, nextStep, prevStep } = useProject();
  const [newLocation, setNewLocation] = useState('');

  const handleSubmitKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const keyword = new FormData(form).get('keyword') as string;
    updateProjectData({ targetKeyword: keyword });
    nextStep();
  };

  const handleSubmitCompanyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    updateProjectData({
      companyInfo: {
        name: data.get('company') as string,
        phone: data.get('phone') as string,
        address: data.get('address') as string,
      },
    });
    nextStep();
  };

  const handleSubmitWebsiteInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    
    // Normalize URLs before saving
    const domain = normalizeUrl(data.get('domain') as string);
    const blogUrl = normalizeUrl(data.get('blogUrl') as string);
    
    updateProjectData({
      websiteInfo: { domain, blogUrl },
    });
    nextStep();
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      updateProjectData({
        locations: [...state.projectData.locations, newLocation.trim()],
      });
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (index: number) => {
    updateProjectData({
      locations: state.projectData.locations.filter((_, i) => i !== index),
    });
  };

  const handleComplete = () => {
    closeQuestionModal();
  };

  if (!state.isQuestionModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-medium text-white">Project Setup</h2>
          <button
            onClick={closeQuestionModal}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {state.currentStep === 0 && (
            <form onSubmit={handleSubmitKeyword} className="space-y-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-zinc-300 mb-1">
                  Target Keyword/Phrase
                </label>
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  required
                  defaultValue={state.projectData.targetKeyword}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                    text-white placeholder-zinc-500"
                  placeholder="Enter your main keyword..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white
                  rounded-lg transition-colors"
              >
                Next
              </button>
            </form>
          )}

          {state.currentStep === 1 && (
            <form onSubmit={handleSubmitCompanyInfo} className="space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-1">
                  Company/Brand Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  defaultValue={state.projectData.companyInfo.name}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                    text-white placeholder-zinc-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  defaultValue={state.projectData.companyInfo.phone}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                    text-white placeholder-zinc-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-zinc-300 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  defaultValue={state.projectData.companyInfo.address}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                    text-white placeholder-zinc-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white
                    rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white
                    rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {state.currentStep === 2 && (
            <form onSubmit={handleSubmitWebsiteInfo} className="space-y-4">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-zinc-300 mb-1">
                  Website Domain
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="text-zinc-500">https://</span>
                  </div>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    required
                    defaultValue={state.projectData.websiteInfo.domain.replace('https://', '')}
                    className="w-full pl-24 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                      text-white placeholder-zinc-500"
                    placeholder="example.com"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">Enter domain without https://</p>
              </div>
              <div>
                <label htmlFor="blogUrl" className="block text-sm font-medium text-zinc-300 mb-1">
                  Blog URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="text-zinc-500">https://</span>
                  </div>
                  <input
                    type="text"
                    id="blogUrl"
                    name="blogUrl"
                    required
                    defaultValue={state.projectData.websiteInfo.blogUrl.replace('https://', '')}
                    className="w-full pl-24 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                      text-white placeholder-zinc-500"
                    placeholder="example.com/blog"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">Enter URL without https://</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white
                    rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white
                    rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {state.currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Target Locations
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                      text-white placeholder-zinc-500"
                    placeholder="Add location..."
                  />
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                      transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {state.projectData.locations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-zinc-800
                        rounded-lg border border-zinc-700"
                    >
                      <span className="text-zinc-300">{location}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(index)}
                        className="p-1 text-zinc-400 hover:text-white rounded-lg
                          hover:bg-zinc-700 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white
                    rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white
                    rounded-lg transition-colors"
                >
                  Complete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}