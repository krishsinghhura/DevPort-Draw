'use client';

import { Plus, Search, Filter } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  filterType: 'all' | 'public' | 'private';
  onCreateRoom: () => void;
}

export default function EmptyState({ searchQuery, filterType, onCreateRoom }: EmptyStateProps) {
  const hasFilters = searchQuery || filterType !== 'all';

  if (hasFilters) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600 mb-6">
            No rooms match your current filters. Try adjusting your search or filter criteria.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
            <button 
              onClick={onCreateRoom}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <Plus className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms yet</h3>
        <p className="text-gray-600 mb-6">
          Get started by creating your first room. You can invite others and collaborate together.
        </p>
        <button 
          onClick={onCreateRoom}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Room
        </button>
      </div>
    </div>
  );
}