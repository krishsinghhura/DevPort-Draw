'use client';

import { Users, Lock, Unlock, Copy, Trash2, Loader2 } from 'lucide-react';
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

interface RoomCardProps {
  room: Room;
  onDelete: (roomId: string) => Promise<void>;
}

export default function RoomCard({ room, onDelete }: RoomCardProps) {
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {room.slug}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Created {new Date(room.createdAt).toLocaleDateString()}
          </p>
        </div>
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
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Members</span>
          <div className="flex items-center space-x-1 text-gray-900">
            <Users className="w-4 h-4" />
            <span>{room.memberCount}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <div className="flex items-center space-x-1">
            {room.isPublic ? (
              <>
                <Unlock className="w-4 h-4 text-green-500" />
                <span className="text-green-700 font-medium">Public</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">Private</span>
              </>
            )}
          </div>
        </div>

        {room.isPublic && room.publicExpiresAt && (
          <div className="text-xs text-gray-500">
            Public until {new Date(room.publicExpiresAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Link
          href={`/room/${room.id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg transition-all text-sm font-medium"
        >
          Enter Room
        </Link>
        <button
          onClick={() => copyRoomLink(room.id)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          title="Copy room link"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}