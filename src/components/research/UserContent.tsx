import React, { useState } from 'react';
import { Plus, X, Link, Image as ImageIcon, Youtube, FileText } from 'lucide-react';
import { normalizeUrl } from '../../utils/url';
import { useOpenAI } from '../../context/OpenAIContext';

interface LinkItem {
  id: string;
  url: string;
  type: 'website' | 'product' | 'resource';
}

interface MediaItem {
  id: string;
  content: string;
  type: 'image' | 'video' | 'iframe';
}

function LinkSection() {
  const { state, updateUserContent } = useOpenAI();
  const [newUrl, setNewUrl] = useState('');
  const [selectedType, setSelectedType] = useState<LinkItem['type']>('website');

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim()) {
      const normalizedUrl = normalizeUrl(newUrl.trim());
      updateUserContent({
        links: [
          ...state.userContent.links,
          {
            id: Date.now().toString(),
            url: normalizedUrl,
            type: selectedType
          }
        ]
      });
      setNewUrl('');
    }
  };

  const removeLink = (id: string) => {
    updateUserContent({
      links: state.userContent.links.filter(link => link.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Links</h3>
      
      <form onSubmit={handleAddLink} className="flex gap-2">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as LinkItem['type'])}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="website">Website</option>
          <option value="product">Product</option>
          <option value="resource">Resource</option>
        </select>
        
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter URL..."
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
            outline-none"
        />
        
        <button
          type="submit"
          disabled={!newUrl.trim()}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium
            hover:bg-emerald-600 transition-colors disabled:opacity-50 
            disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      <div className="space-y-2">
        {state.userContent.links.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg
              border border-zinc-700 group"
          >
            <Link className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <span className="flex-1 text-zinc-300 truncate">{link.url}</span>
            <span className="text-sm text-zinc-500 px-2 py-1 bg-zinc-700 rounded">
              {link.type}
            </span>
            <button
              onClick={() => removeLink(link.id)}
              className="p-1 text-zinc-500 hover:text-white rounded
                opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaSection() {
  const { state, updateUserContent } = useOpenAI();
  const [newContent, setNewContent] = useState('');
  const [selectedType, setSelectedType] = useState<MediaItem['type']>('image');

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContent.trim()) {
      updateUserContent({
        media: [
          ...state.userContent.media,
          {
            id: Date.now().toString(),
            content: newContent.trim(),
            type: selectedType
          }
        ]
      });
      setNewContent('');
    }
  };

  const removeMedia = (id: string) => {
    updateUserContent({
      media: state.userContent.media.filter(item => item.id !== id)
    });
  };

  const getMediaIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Youtube className="w-4 h-4" />;
      case 'iframe':
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Media Assets</h3>
      
      <form onSubmit={handleAddMedia} className="space-y-3">
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as MediaItem['type'])}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
              text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="image">Image URL</option>
            <option value="video">Video Embed</option>
            <option value="iframe">Custom Iframe</option>
          </select>
          
          <button
            type="submit"
            disabled={!newContent.trim()}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium
              hover:bg-emerald-600 transition-colors disabled:opacity-50 
              disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder={
            selectedType === 'image' ? "Enter image URL..." :
            selectedType === 'video' ? "Paste video embed code..." :
            "Enter custom iframe code..."
          }
          rows={3}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
            outline-none resize-none"
        />
      </form>

      <div className="space-y-2">
        {state.userContent.media.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg
              border border-zinc-700 group"
          >
            {getMediaIcon(item.type)}
            <span className="flex-1 text-zinc-300 truncate">{item.content}</span>
            <span className="text-sm text-zinc-500 px-2 py-1 bg-zinc-700 rounded">
              {item.type}
            </span>
            <button
              onClick={() => removeMedia(item.id)}
              className="p-1 text-zinc-500 hover:text-white rounded
                opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdditionalContent() {
  const { state, updateUserContent } = useOpenAI();

  const handleChange = (field: keyof typeof state.userContent.additionalContent) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateUserContent({
      additionalContent: {
        ...state.userContent.additionalContent,
        [field]: e.target.value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Additional Content</h3>
      
      {/* Company Information */}
      <div className="space-y-2">
        <label className="block text-zinc-300 font-medium">
          Company Information
        </label>
        <textarea
          rows={4}
          value={state.userContent.additionalContent.companyInfo}
          onChange={handleChange('companyInfo')}
          placeholder="Enter company information..."
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
            outline-none resize-none"
        />
      </div>

      {/* Special Notes */}
      <div className="space-y-2">
        <label className="block text-zinc-300 font-medium">
          Special Notes & Requirements
        </label>
        <textarea
          rows={4}
          value={state.userContent.additionalContent.specialNotes}
          onChange={handleChange('specialNotes')}
          placeholder="Enter any special notes or requirements..."
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
            outline-none resize-none"
        />
      </div>

      {/* Team Credentials */}
      <div className="space-y-2">
        <label className="block text-zinc-300 font-medium">
          Team Member Credentials
        </label>
        <textarea
          rows={4}
          value={state.userContent.additionalContent.teamCredentials}
          onChange={handleChange('teamCredentials')}
          placeholder="Enter team member credentials..."
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
            outline-none resize-none"
        />
      </div>

      {/* Call-to-Action Preferences */}
      <div className="space-y-2">
        <label className="block text-zinc-300 font-medium">
          Call-to-Action Preferences
        </label>
        <textarea
          rows={4}
          value={state.userContent.additionalContent.ctaPreferences}
          onChange={handleChange('ctaPreferences')}
          placeholder="Enter call-to-action preferences..."
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
            text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
            outline-none resize-none"
        />
      </div>
    </div>
  );
}

export default function UserContent() {
  return (
    <div className="space-y-8">
      <LinkSection />
      <MediaSection />
      <AdditionalContent />
    </div>
  );
}