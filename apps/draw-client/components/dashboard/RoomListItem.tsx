'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Globe, Lock, Trash2, ExternalLink } from 'lucide-react';

interface Room {
  id: string;
  slug: string;
  memberCount: number;
  isPublic: boolean;
  publicExpiresAt?: string;
  createdAt: string;
  lastActivity: string;
}

interface RoomListItemProps {
  room: Room;
  onDelete: (roomId: string) => Promise<void>;
}

export default function RoomListItem({ room, onDelete }: RoomListItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(room.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete room:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
            {/* Room Info */}
            <div className="flex items-center space-x-6 flex-1">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
                  {room.slug}
                </h3>
                <div className="flex items-center">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      room.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {room.isPublic ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </>
                    )}
                  </span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{room.memberCount} member{room.memberCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Created {formatDate(room.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => router.push(`/canvas/${room.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Enter
              </button>
              
              <button 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{room.memberCount} members</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(room.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Room</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{room.slug}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}