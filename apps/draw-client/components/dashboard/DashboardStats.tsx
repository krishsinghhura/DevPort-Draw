'use client';

import { Users, Lock, Unlock, Grid3X3 } from 'lucide-react';

interface Room {
  id: string;
  slug: string;
  memberCount: number;
  isPublic: boolean;
  publicExpiresAt?: string;
  createdAt: string;
  lastActivity: string;
}

interface DashboardStatsProps {
  rooms: Room[];
}

export default function DashboardStats({ rooms }: DashboardStatsProps) {
  const stats = {
    totalRooms: rooms.length,
    publicRooms: rooms.filter(r => r.isPublic).length,
    privateRooms: rooms.filter(r => !r.isPublic).length,
    totalMembers: rooms.reduce((acc, room) => acc + room.memberCount, 0),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Rooms</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalRooms}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Public Rooms</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.publicRooms}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <Unlock className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Private Rooms</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.privateRooms}</p>
          </div>
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Members</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalMembers}</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}