'use client';

import { Plus, LogOut, Wand2 } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  onCreateRoom: () => void;
  onLogout: () => void;
}

export default function DashboardHeader({ onCreateRoom, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DevPort Draw</h1>
                <p className="text-sm text-gray-500">Creative Collaboration Platform</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              href="/canvas/guest"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all text-sm font-medium"
            >
              <Wand2 className="w-4 h-4" />
              <span>Try Canvas</span>
            </Link>
            
            <button
              onClick={onCreateRoom}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Room</span>
            </button>
            
            <button
              onClick={onLogout}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}