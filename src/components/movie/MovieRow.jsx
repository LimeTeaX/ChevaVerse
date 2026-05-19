// src/components/movie/MovieRow.jsx
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Sparkles, Trophy, Clapperboard, Film } from 'lucide-react';
import MovieCard from './MovieCard';

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (dir) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      const newScrollLeft = rowRef.current.scrollLeft + (dir * scrollAmount);
      
      rowRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Cek ulang setelah scroll selesai
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="mb-7">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="font-display font-700 text-[17px] text-white flex items-center gap-2">
          {getRowIcon(title)}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            className={`w-7 h-7 rounded-full border transition-all duration-200 flex items-center justify-center
              ${canScrollLeft 
                ? 'bg-white/[0.05] border-white/[0.08] text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30' 
                : 'bg-white/[0.02] border-white/[0.04] text-gray-600 cursor-not-allowed'
              }`}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            className={`w-7 h-7 rounded-full border transition-all duration-200 flex items-center justify-center
              ${canScrollRight 
                ? 'bg-white/[0.05] border-white/[0.08] text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30' 
                : 'bg-white/[0.02] border-white/[0.04] text-gray-600 cursor-not-allowed'
              }`}
          >
            <ChevronRight size={14} />
          </button>
          <button 
            onClick={() => {
              // Handle "See All" navigation
              const pathMap = {
                'Now Playing': '/category/now-playing',
                'Trending Now': '/category/trending',
                'Anime Spotlight': '/category/anime-spotlight',
                'Top Rated': '/category/top-rated',
                'Animation Movies': '/category/animation-movies',
              };
              const path = pathMap[title] || '/category/movies';
              window.location.href = path;
            }}
            className="text-[12px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium ml-1 flex items-center gap-1"
          >
            See All <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3.5">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[175px] animate-fadeInUp">
              <div className="w-full h-[262px] rounded-[20px] bg-white/[0.05] skeleton-shimmer" />
              <div className="h-3 bg-white/[0.05] rounded mt-3 w-3/4 skeleton-shimmer" />
              <div className="h-2.5 bg-white/[0.05] rounded mt-1.5 w-1/2 skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={rowRef}
          className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-1"
          style={{ scrollBehavior: 'smooth' }}
          onScroll={checkScroll}
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