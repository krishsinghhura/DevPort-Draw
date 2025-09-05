'use client';

import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (slug: string) => Promise<void>;
}

export default function CreateRoomModal({ isOpen, onClose, onCreateRoom }: CreateRoomModalProps) {
  const [slug, setSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slug.trim()) {
      setError('Room name is required');
      return;
    }

    if (slug.trim().length < 3) {
      setError('Room name must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(slug.trim())) {
      setError('Room name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      await onCreateRoom(slug.trim());
      setSlug('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setSlug('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Room</h2>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Choose a unique name for your room. This will be used as the room's identifier.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Room Name
              </label>
              <input
                id="slug"
                type="text"
                placeholder="my-awesome-room"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setError('');
                }}
                disabled={isCreating}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500">
                Use letters, numbers, hyphens, and underscores only
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isCreating || !slug.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}