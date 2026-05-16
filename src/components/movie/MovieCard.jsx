import { Star, Film, Tv } from 'lucide-react';
import { tmdbApi } from '../../services/tmdbApi';

export default function MovieCard({ item, onClick }) {
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const title = item.title || item.name;
  const year = item.release_date || item.first_air_date;
  const yearNum = year ? new Date(year).getFullYear() : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

  return (
    <div className="group cursor-pointer" onClick={() => onClick(item, mediaType)}>
      <div className="relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
        <img
          src={tmdbApi.getImage(item.poster_path, 'w342')}
          alt={title}
          className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {rating !== 'N/A' && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-1 text-xs font-semibold">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white">{rating}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/70 rounded-full p-1.5">
          {mediaType === 'movie' ? <Film size={12} className="text-white" /> : <Tv size={12} className="text-white" />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="mt-2">
        <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{yearNum}</p>
      </div>
    </div>
  );
}