import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

interface NameEditorProps {
  currentName: string;
  onSave: (newName: string) => void;
}

export default function NameEditor({ currentName, onSave }: NameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name !== currentName) {
      onSave(name.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(currentName);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white 
          rounded-lg hover:bg-zinc-800 px-2 py-1 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
        <span className="text-sm">Edit Name</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg
          text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 
          focus:border-transparent outline-none text-sm"
        placeholder="Enter assistant name..."
        autoFocus
      />
      <button
        type="submit"
        className="p-1 text-emerald-500 hover:text-emerald-400 rounded
          hover:bg-zinc-800 transition-colors"
        title="Save"
      >
        <Save className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className="p-1 text-zinc-400 hover:text-white rounded
          hover:bg-zinc-800 transition-colors"
        title="Cancel"
      >
        <X className="w-4 h-4" />
      </button>
    </form>
  );
}