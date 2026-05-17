// src/pages/SettingsPage.jsx
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, CheckCircle, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { signOut } = useAuth();
  const [notif, setNotif] = useState(null);

  const clearAllData = () => {
    if (confirm('Are you sure? This will delete ALL your favorites and watchlist.')) {
      localStorage.removeItem('favorites');
      localStorage.removeItem('watchlist');
      setNotif({ type: 'success', text: 'All data cleared!' });
      setTimeout(() => setNotif(null), 2000);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <h1 className="font-display text-2xl font-bold text-white mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Clear Data */}
          <div className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-400" />
              <div>
                <p className="text-white font-medium">Clear All Data</p>
                <p className="text-xs text-gray-500">Delete favorites & watchlist</p>
              </div>
            </div>
            <button
              onClick={clearAllData}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all"
            >
              Clear
            </button>
          </div>

          {/* Sign Out */}
          <div className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-gray-400" />
              <div>
                <p className="text-white font-medium">Sign Out</p>
                <p className="text-xs text-gray-500">Logout from your account</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-sm font-medium hover:bg-white/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Notification */}
        {notif && (
          <div className="fixed bottom-4 right-4 z-50 bg-[#0F1A36] border border-green-500/30 rounded-xl px-4 py-3 shadow-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle size={18} className="text-green-400" />
            <p className="text-sm text-green-300">{notif.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}