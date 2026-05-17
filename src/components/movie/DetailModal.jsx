// src/components/movie/DetailModal.jsx
import { X, Star, Clock, Calendar, Tv, Plus, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { tmdbApi } from '../../services/tmdbApi';

export default function DetailModal({ item, onClose }) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Cek apakah item sudah ada di watchlist
  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.some(w => w.id === item.id));
  }, [item.id]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
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
        media_type: item.mediaType || (item.first_air_date ? 'tv' : 'movie')
      }];
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      setIsInWatchlist(true);
    }
  };

  const removeFromWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const newWatchlist = watchlist.filter(w => w.id !== item.id);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    setIsInWatchlist(false);
  };

  if (!item) return null;

  const title = item.title || item.name;
  const year = item.release_date || item.first_air_date;
  const yearNum = year ? new Date(year).getFullYear() : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const trailer = item.videos?.[0];
  const backdropUrl = tmdbApi.getImage(item.backdrop_path || item.poster_path, 'original');
  const posterUrl = tmdbApi.getImage(item.poster_path, 'w342');
  const runtime = item.runtime ? `${item.runtime} min` : item.episode_run_time?.[0] ? `${item.episode_run_time[0]}m/ep` : '';
  const genres = item.genres || [];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[88vh] overflow-y-auto rounded-[24px] bg-[#0F1A36] border border-white/[0.08] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        <div className="relative h-52 md:h-64 overflow-hidden rounded-t-[24px]">
          <img src={backdropUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A36] via-[#0F1A36]/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-10 relative z-10">
          <div className="flex gap-5">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <img
                src={posterUrl}
                alt={title}
                className="w-28 rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-800 text-2xl text-white leading-tight mb-1">{title}</h2>
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-400 mb-3">
                {yearNum !== 'N/A' && (
                  <span className="flex items-center gap-1"><Calendar size={11} />{yearNum}</span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1"><Clock size={11} />{runtime}</span>
                )}
                {rating !== 'N/A' && (
                  <span className="flex items-center gap-1 text-gold-400 font-semibold">
                    <Star size={11} className="fill-gold-400" />{rating}
                    <span className="text-gray-500 font-normal">/10</span>
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {genres.map((g) => (
                    <span key={g.id} className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/20 text-[11px] text-cyan-300 font-medium">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="font-semibold text-white text-sm mb-1.5">Synopsis</h3>
              <p className="text-gray-300 text-[13px] leading-relaxed">
                {item.overview || 'No synopsis available.'}
              </p>
            </div>
          </div>

          {/* Trailer */}
          {trailer && (
            <div className="mt-6">
              <h3 className="font-display font-700 text-white text-[15px] mb-3">Trailer</h3>
              <div className="aspect-video rounded-xl overflow-hidden border border-white/[0.08]">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Tombol Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={isInWatchlist ? removeFromWatchlist : addToWatchlist}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] transition-all ${isInWatchlist
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'btn-secondary'
                }`}
            >
              {isInWatchlist ? (
                <>
                  <CheckCheck size={16} />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add to Watchlist
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn-primary py-3 rounded-[14px] text-white font-semibold text-[14px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}