// src/pages/NotificationsPage.jsx
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { Star, Clapperboard, Bell, Film, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to ChevaVerse!',
      message: 'Start exploring movies and anime today.',
      time: new Date(),
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'New Trending Movies',
      message: 'Check out this week top 10 movies.',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'trending',
      read: false
    },
    {
      id: 3,
      title: 'Anime Spotlight',
      message: 'New anime episodes available.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: 'anime',
      read: true
    },
    {
      id: 4,
      title: 'New Movie Added',
      message: 'Deadpool 3 is now available!',
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: 'movie',
      read: false
    },
    {
      id: 5,
      title: 'Season Finale',
      message: 'The Boys season 5 finale airs today!',
      time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'trending',
      read: false
    }
  ]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'trending': return <Star size={18} className="text-gold-400" />;
      case 'anime': return <Clapperboard size={18} className="text-cyan-400" />;
      case 'movie': return <Film size={18} className="text-cyan-400" />;
      default: return <Bell size={18} className="text-gray-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-3 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`glass-card rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.06] ${
                  !notif.read ? 'border-cyan-500/30 bg-cyan-500/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{notif.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatTime(notif.time)}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}