// src/components/movie/MovieCard.jsx
import { Star, Film, Tv } from 'lucide-react';
import { tmdbApi } from '../../services/tmdbApi';

export default function MovieCard({ item, onClick, rank }) {
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const title = item.title || item.name;
  const year = item.release_date || item.first_air_date;
  const yearNum = year ? new Date(year).getFullYear() : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

  return (
    <div
      className="group cursor-pointer flex-shrink-0 w-[175px] animate-fadeInUp"
      style={{ animationDelay: `${Math.random() * 0.1}s` }}
      onClick={() => onClick(item, mediaType)}
    >
      <div className="relative w-full h-[262px] rounded-[20px] overflow-hidden bg-[#0F1A36] transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <img
          src={tmdbApi.getImage(item.poster_path, 'w342')}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay gradient halus saat hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {rank && (
          <div className="absolute top-2.5 left-2.5 w-[28px] h-[28px] rounded-[8px] bg-gradient-to-br from-cyan-500 to-gold-500 flex items-center justify-center font-display font-800 text-white text-[13px] shadow-lg transition-transform group-hover:scale-110">
            {rank}
          </div>
        )}

        {!rank && rating !== 'N/A' && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-semibold border border-white/10 transition-all group-hover:bg-black/90">
            <Star size={10} className="text-gold-400 fill-gold-400" />
            <span className="text-white">{rating}</span>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md rounded-full p-1.5 border border-white/10 transition-all group-hover:bg-cyan-500/50 group-hover:border-cyan-400">
          {mediaType === 'movie'
            ? <Film size={11} className="text-gray-300 group-hover:text-white transition-colors" />
            : <Tv size={11} className="text-gray-300 group-hover:text-white transition-colors" />
          }
        </div>
      </div>

      <div className="mt-2.5 px-0.5 transition-all group-hover:translate-x-1">
        <h3 className="font-display font-600 text-[13px] text-white line-clamp-1 leading-snug group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5 transition-colors group-hover:text-gray-400">
          {yearNum}
          {rank && rating !== 'N/A' && <span> · ⭐ {rating}</span>}
        </p>
      </div>
    </div>
  );
}