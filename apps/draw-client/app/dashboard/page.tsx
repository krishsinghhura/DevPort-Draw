'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { HTTP_BACKEND } from '@/config';

// Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardControls from '@/components/dashboard/DashboardControl';
import RoomCard from '@/components/dashboard/RoomCard';
import RoomListItem from '@/components/dashboard/RoomListItem';
import CreateRoomModal from '@/components/dashboard/CreateRoomModal';
import EmptyState from '@/components/dashboard/EmptyState';

interface Room {
  id: string;
  slug: string;
  memberCount: number;
  isPublic: boolean;
  publicExpiresAt?: string;
  createdAt: string;
  lastActivity: string;
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSlugModal, setShowSlugModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (typeof window === 'undefined') return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${HTTP_BACKEND}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRooms(data.rooms || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const handleCreateRoom = async (slug: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${HTTP_BACKEND}/create-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ slug }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create room');

    router.push(`/canvas/${data.roomId}`);
  };

  const handleDeleteRoom = async (roomId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${HTTP_BACKEND}/room/${roomId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete room');
    }

    // Remove the room from the local state
    setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'public' && room.isPublic) ||
      (filterType === 'private' && !room.isPublic);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardHeader 
        onCreateRoom={() => setShowSlugModal(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats rooms={rooms} />

        <DashboardControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {loading ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <p className="text-gray-600">Loading your rooms...</p>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            filterType={filterType}
            onCreateRoom={() => setShowSlugModal(true)}
          />
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredRooms.map((room) => (
              viewMode === 'grid' ? (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onDelete={handleDeleteRoom}
                />
              ) : (
                <RoomListItem 
                  key={room.id} 
                  room={room} 
                  onDelete={handleDeleteRoom}
                />
              )
            ))}
          </div>
        )}
      </main>

      <CreateRoomModal
        isOpen={showSlugModal}
        onClose={() => setShowSlugModal(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}