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
      className="group cursor-pointer flex-shrink-0 w-[175px]"
      onClick={() => onClick(item, mediaType)}
    >
      {/* Poster */}
      <div className="relative w-full h-[262px] rounded-[20px] overflow-hidden bg-[#0F1A36] movie-card-hover">
        <img
          src={tmdbApi.getImage(item.poster_path, 'w342')}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Rank badge */}
        {rank && (
          <div className="absolute top-2.5 left-2.5 w-[28px] h-[28px] rounded-[8px] bg-gradient-to-br from-cyan-500 to-gold-500 flex items-center justify-center font-display font-800 text-white text-[13px]">
            {rank}
          </div>
        )}

        {/* Rating badge (no rank mode) */}
        {!rank && rating !== 'N/A' && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-semibold border border-white/10">
            <Star size={10} className="text-gold-400 fill-gold-400" />
            <span className="text-white">{rating}</span>
          </div>
        )}

        {/* Media type icon */}
        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md rounded-full p-1.5 border border-white/10">
          {mediaType === 'movie'
            ? <Film size={11} className="text-gray-300" />
            : <Tv size={11} className="text-gray-300" />
          }
        </div>
      </div>

      {/* Info */}
      <div className="mt-2.5 px-0.5">
        <h3 className="font-display font-600 text-[13px] text-white line-clamp-1 leading-snug">{title}</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {yearNum}
          {rank && rating !== 'N/A' && <span> · ⭐ {rating}</span>}
        </p>
      </div>
    </div>
  );
}