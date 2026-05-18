// src/components/layout/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import {
  Film, Search, Bell, User, ChevronDown,
  Home, Star, TrendingUp, Calendar,
  Heart, Bookmark, Tv, Clapperboard, LogOut, Settings,
  X, Menu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';

const BROWSE_MENU = [
  { label: 'Home', icon: Home, path: '/app' },
  { label: 'Movies', icon: Film, path: '/movies' },
  { label: 'TV Shows', icon: Tv, path: '/tv' },
  { label: 'Anime', icon: Clapperboard, path: '/anime' },
  { label: 'Trending', icon: TrendingUp, path: '/trending' },
  { label: 'Top Rated', icon: Star, path: '/top-rated' },
  { label: 'Upcoming', icon: Calendar, path: '/upcoming' },
];

const LIBRARY_MENU = [
  { label: 'Favorites', icon: Heart, path: '/favorites' },
  { label: 'Watchlist', icon: Bookmark, path: '/watchlist' },
];

const PROFILE_MENU = [
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Logout', icon: LogOut, path: null },
];

export default function Navbar({ searchQuery, onSearch, onClear, activePage, onNavigate }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path, label) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(label);
    navigate(path);
  };

  const handleProfileAction = (label, path) => {
    setOpenDropdown(null);
    if (label === 'Logout') {
      localStorage.removeItem('pb_token');
      localStorage.removeItem('pb_user');
      navigate('/login');
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0A1628]/95 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="px-4 md:px-6">
        <div ref={navbarRef} className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavigate('/', 'Home')}
            className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <img src="/chevaverse.png" alt="ChevaVerse" className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-display font-bold text-xl gradient-text hidden sm:inline">
              ChevaVerse
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 ml-6">
            {/* Browse Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'browse' ? null : 'browse')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${openDropdown === 'browse'
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
              >
                Browse
                <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'browse' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'browse' && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-[#0F1A36] border border-white/[0.08] shadow-xl py-2 overflow-hidden">
                  {BROWSE_MENU.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigate(item.path, item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 text-left
                        ${activePage === item.label
                          ? 'text-cyan-400 bg-cyan-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Library Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'library' ? null : 'library')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
      ${openDropdown === 'library'
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
              >
                My Library
                <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'library' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'library' && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-[#0F1A36] border border-white/[0.08] shadow-xl py-2 overflow-hidden">
                  <Link
                    to="/favorites"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <Heart size={16} />
                    Favorites
                  </Link>
                  <Link
                    to="/watchlist"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <Bookmark size={16} />
                    Watchlist
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search movies, anime, TV shows..."
                className="
                  w-full h-10 pl-11 pr-10 rounded-xl
                  bg-white/[0.04] border border-white/[0.08]
                  focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10
                  text-white placeholder:text-gray-500 text-sm
                  transition-all duration-200
                "
              />
              {searchQuery && (
                <button
                  onClick={onClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="hidden md:flex w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.07] transition-all">
              <NotificationBell />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-sm">
                  👤
                </div>
                <ChevronDown size={12} className="text-gray-500" />
              </button>

              {openDropdown === 'profile' && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-[#0F1A36] border border-white/[0.08] shadow-xl py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.06] mb-2">
                    <p className="text-white text-sm font-semibold">Guest User</p>
                    <p className="text-cyan-400 text-xs">⭐ Member</p>
                  </div>
                  {PROFILE_MENU.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleProfileAction(item.label, item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200
                        ${item.label === 'Logout'
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.06]">
            <div className="space-y-1">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 tracking-wider">BROWSE</div>
              {BROWSE_MENU.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.path, item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-left
                    ${activePage === item.label
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="h-px bg-white/[0.06] my-2" />
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 tracking-wider">MY LIBRARY</div>
              {LIBRARY_MENU.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => {
                    setOpenDropdown(null);
                    setMobileMenuOpen(false);
                    if (onNavigate) onNavigate(item.label);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200
                    ${activePage === item.label
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
