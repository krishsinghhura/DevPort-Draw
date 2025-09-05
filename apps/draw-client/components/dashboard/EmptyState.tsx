'use client';

import { Grid3X3, Plus } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  filterType: 'all' | 'public' | 'private';
  onCreateRoom: () => void;
}

export default function EmptyState({ searchQuery, filterType, onCreateRoom }: EmptyStateProps) {
  const isFiltered = searchQuery || filterType !== 'all';

  return (
    <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Grid3X3 className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isFiltered ? 'No rooms found' : 'No rooms yet'}
      </h3>
      <p className="text-gray-600 mb-6">
        {isFiltered 
          ? 'Try adjusting your search or filter criteria'
          : 'Create your first room to start collaborating'
        }
      </p>
      {!isFiltered && (
        <button
          onClick={onCreateRoom}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Create Your First Room</span>
        </button>
      )}
    </div>
  );
}