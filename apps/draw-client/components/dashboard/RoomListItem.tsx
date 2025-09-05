'use client';

import { Users, Lock, Unlock, Copy, Grid3X3, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
  const [deleting, setDeleting] = useState(false);

  const copyRoomLink = (roomId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${room.slug}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await onDelete(room.id);
    } catch (error) {
      console.error('Failed to delete room:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {room.slug}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{room.memberCount} members</span>
              </div>
              <div className="flex items-center space-x-1">
                {room.isPublic ? (
                  <>
                    <Unlock className="w-4 h-4 text-green-500" />
                    <span className="text-green-700">Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span>Private</span>
                  </>
                )}
              </div>
              <span>Created {new Date(room.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyRoomLink(room.id)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            title="Copy room link"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete room"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
          <Link
            href={`/room/${room.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
          >
            Enter Room
          </Link>
        </div>
      </div>
    </div>
  );
}