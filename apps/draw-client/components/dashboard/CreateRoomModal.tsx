'use client';

import { Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (slug: string) => Promise<void>;
}

export default function CreateRoomModal({ isOpen, onClose, onCreateRoom }: CreateRoomModalProps) {
  const [slugInput, setSlugInput] = useState('');
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!slugInput.trim()) return;

    setCreating(true);
    try {
      await onCreateRoom(slugInput);
      setSlugInput('');
      onClose();
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setSlugInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Room</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={creating}
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Room Name
            </label>
            <input
              id="slug"
              type="text"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              placeholder="Enter a unique room name..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={creating}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <p className="text-xs text-gray-500 mt-2">
              Choose a memorable name for your room. This will be visible to all members.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
            disabled={creating}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={creating || !slugInput.trim()}
            className="px-6 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Room</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}