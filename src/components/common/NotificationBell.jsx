// src/components/common/NotificationBell.jsx
import { useState, useEffect, useRef } from 'react';
import { Bell, Star, Clapperboard, ChevronRight, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
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

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedNotifications = [...notifications].sort((a, b) => b.time - a.time);
  const latest3 = sortedNotifications.slice(0, 3);
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasMore = notifications.length > 3;

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
      case 'trending': return <Star size={14} className="text-gold-400" />;
      case 'anime': return <Clapperboard size={14} className="text-cyan-400" />;
      case 'movie': return <Film size={14} className="text-cyan-400" />;
      default: return <Bell size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 rounded-xl bg-[#0F1A36] border border-white/[0.08] shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No notifications
              </div>
            ) : (
              <>
                {latest3.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`px-4 py-3 border-b border-white/[0.06] cursor-pointer transition-all hover:bg-white/[0.04] ${
                      !notif.read ? 'bg-cyan-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                        <p className="text-[10px] text-gray-600 mt-1">{formatTime(notif.time)}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <Link
                    to="/notifications"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1 px-4 py-3 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-white/[0.04] transition-colors border-t border-white/[0.06]"
                  >
                    <span>See all notifications</span>
                    <ChevronRight size={12} />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}