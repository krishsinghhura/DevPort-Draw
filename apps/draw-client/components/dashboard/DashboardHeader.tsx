'use client';

import { Plus, LogOut, Users } from 'lucide-react';

interface DashboardHeaderProps {
  onCreateRoom: () => void;
  onLogout: () => void;
}

export default function DashboardHeader({ onCreateRoom, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-gray-400">Manage your rooms</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCreateRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Room</span>
            </button>
            
            <button
              onClick={onLogout}
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}