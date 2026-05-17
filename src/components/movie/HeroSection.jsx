// src/components/movie/HeroSection.jsx
import { useState, useEffect } from 'react';
import { Play, Plus, Star, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { tmdbApi } from '../../services/tmdbApi';

export default function HeroSection({ onCardClick }) {
  const [heroItems, setHeroItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [notification, setNotification] = useState(null);

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

const addToWatchlist = (item) => {
  const exists = watchlist.some(w => w.id === item.id);
  if (!exists) {
    const newWatchlist = [...watchlist, {
      id: item.id,
      title: item.title || item.name,
      name: item.name,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: item.release_date,     
      first_air_date: item.first_air_date,
      media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
    }];
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    setNotification({ type: 'success', text: `Added to Watchlist` });
    setTimeout(() => setNotification(null), 2000);
  } else {
    setNotification({ type: 'error', text: `Already in Watchlist` });
    setTimeout(() => setNotification(null), 2000);
  }
};

  useEffect(() => {
    const loadHero = async () => {
      try {
        const data = await tmdbApi.getTrending(1);
        // Ambil 5 item teratas dari trending
        setHeroItems(data.results?.slice(0, 5) || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    loadHero();
  }, []);

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  const prev = () => goTo((current - 1 + heroItems.length) % heroItems.length);
  const next = () => goTo((current + 1) % heroItems.length);

  useEffect(() => {
    if (heroItems.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [current, heroItems.length]);

  if (loading || heroItems.length === 0) {
    return <div className="relative h-[420px] rounded-[28px] overflow-hidden mb-7 bg-[#0F1A36] animate-pulse" />;
  }

  const item = heroItems[current];
  const title = item.title || item.name;
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const year = item.release_date || item.first_air_date;
  const yearNum = year ? new Date(year).getFullYear() : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const backdropUrl = tmdbApi.getImage(item.backdrop_path || item.poster_path, 'original');

  // Dapetin genre names
  const genreNames = item.genre_ids?.slice(0, 3).map(id => {
    const genres = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
      10752: 'War', 37: 'Western', 10759: 'Action & Adventure', 10762: 'Kids',
      10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
      10767: 'Talk', 10768: 'War & Politics'
    };
    return genres[id];
  }).filter(Boolean).join(', ') || 'Trending';

  return (
    <div className="relative h-[420px] rounded-[28px] overflow-hidden mb-7 group">
      {/* Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-[8s]"
        />
      </div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/96 via-[#0A1628]/70 to-[#0A1628]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 via-transparent to-transparent" />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col justify-center h-full pl-12 max-w-[520px] gap-3.5 transition-all duration-500 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      >
        {/* Badge */}
        <div className="flex items-center gap-2 w-fit">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/18 border border-cyan-500/28 text-[11px] font-semibold text-cyan-300 tracking-wide">
            <Star size={9} className="fill-gold-400 text-gold-400" />
            {mediaType === 'tv' ? 'TV SERIES' : 'NOW TRENDING'}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-900 text-[60px] leading-none text-white tracking-tight">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-2 text-[13px] text-gray-400">
          <span>{yearNum}</span>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span>{genreNames}</span>
        </div>

        {/* Description */}
        <p className="text-[15px] leading-relaxed text-gray-300 max-w-[430px] line-clamp-3">
          {item.overview || 'No description available.'}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => onCardClick(item, mediaType)}
            className="btn-primary flex items-center gap-2.5 px-6 h-[50px] rounded-[16px] text-white font-semibold text-[14px]"
          >
            <Play size={15} className="fill-white" />
            View Details
          </button>
          <button
            onClick={() => addToWatchlist(item)}
            className="btn-secondary flex items-center gap-2.5 px-5 h-[50px] rounded-[16px] text-white font-medium text-[14px]"
          >
            <Plus size={16} />
            Add to Watchlist
          </button>
        </div>
      </div>

      {/* Rating badge */}
      <div className="absolute top-5 right-5 z-10 text-right">
        <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3.5 py-2 border border-white/10">
          <Star size={14} className="text-gold-400 fill-gold-400" />
          <span className="font-display font-700 text-white text-lg">{rating}</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1 pr-1">TMDB Score</p>
      </div>

      {/* Arrow navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500/30 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500/30 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-12 z-10 flex items-center gap-1.5">
        {heroItems.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === current
              ? 'w-8 bg-gradient-to-r from-cyan-500 to-gold-500'
              : 'w-4 bg-white/20 hover:bg-white/40'
              }`}
          />
        ))}
      </div>

      {notification && (
        <div className={`fixed top-20 right-4 z-50 bg-[#0F1A36] border rounded-xl px-4 py-3 shadow-xl animate-fadeIn flex items-center gap-2 ${notification.type === 'success' ? 'border-green-500/30' : 'border-yellow-500/30'
          }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={18} className="text-green-400" />
          ) : (
            <AlertCircle size={18} className="text-yellow-400" />
          )}
          <p className={`text-sm ${notification.type === 'success' ? 'text-green-300' : 'text-yellow-300'}`}>
            {notification.text}
          </p>
        </div>
      )}

    </div>
  );
}