// src/components/movie/MovieRow.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame, Sparkles, Trophy, Clapperboard, Film } from 'lucide-react';
import MovieCard from './MovieCard';

// Mapping icon berdasarkan title
const getRowIcon = (title) => {
  switch (title) {
    case 'Trending Now':
      return <Flame size={18} className="text-orange-500" />;
    case 'Anime Spotlight':
      return <Sparkles size={18} className="text-cyan-400" />;
    case 'Top Rated':
      return <Trophy size={18} className="text-gold-400" />;
    case 'Animation Movies':
      return <Clapperboard size={18} className="text-cyan-400" />;
    case 'Now Playing':
      return <Film size={18} className="text-cyan-400" />;
    default:
      return null;
  }
};

export default function MovieRow({ title, items, onCardClick, showRank = false, loading = false }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="font-display font-700 text-[17px] text-white flex items-center gap-2">
          {getRowIcon(title)}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
          >
            <ChevronRight size={14} />
          </button>
          <Link
            to={`/category/${title.toLowerCase().replace(/ /g, '-')}`}
            className="text-[12px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium ml-1 flex items-center gap-1"
          >
            See All <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex gap-3.5">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[175px] animate-pulse">
              <div className="w-full h-[262px] rounded-[20px] bg-white/[0.05]" />
              <div className="h-3 bg-white/[0.05] rounded mt-3 w-3/4" />
              <div className="h-2.5 bg-white/[0.05] rounded mt-1.5 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={rowRef}
          className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-1"
        >
          {items.map((item, idx) => (
            <MovieCard
              key={item.id}
              item={item}
              onClick={onCardClick}
              rank={showRank ? idx + 1 : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}