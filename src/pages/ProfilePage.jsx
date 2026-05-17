// src/pages/ProfilePage.jsx
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Settings, LogOut, Heart, Bookmark, Star } from 'lucide-react';

export default function ProfilePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();

  const stats = [
    { label: 'Favorites', value: JSON.parse(localStorage.getItem('favorites') || '[]').length, icon: Heart, color: 'text-red-400' },
    { label: 'Watchlist', value: JSON.parse(localStorage.getItem('watchlist') || '[]').length, icon: Bookmark, color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-4xl">
              👤
            </div>
            <div className="text-center md:text-left">
              <h1 className="font-display text-2xl font-bold text-white">{user?.email || 'Guest User'}</h1>
              <p className="text-cyan-400 text-sm mt-1">⭐ Member since {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <stat.icon size={24} className={`${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Mail size={18} className="text-cyan-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-white text-sm">{user?.email || 'Not logged in'}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = '/settings'}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              onClick={signOut}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}