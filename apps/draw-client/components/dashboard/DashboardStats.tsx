'use client';

import { Users, Globe, Lock, Activity } from 'lucide-react';

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
  const totalRooms = rooms.length;
  const publicRooms = rooms.filter(room => room.isPublic).length;
  const privateRooms = totalRooms - publicRooms;
  const totalMembers = rooms.reduce((sum, room) => sum + room.memberCount, 0);

  const stats = [
    {
      name: 'Total Rooms',
      value: totalRooms,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Public Rooms',
      value: publicRooms,
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Private Rooms',
      value: privateRooms,
      icon: Lock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Total Members',
      value: totalMembers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}