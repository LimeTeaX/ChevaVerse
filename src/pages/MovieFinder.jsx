import { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from '../components/movie/MovieCard';
import { Search, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-xl aspect-[2/3]" />
          <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="mt-1 h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function DetailModal({ item, onClose }) {
  const title = item.title || item.name;
  const year = item.release_date || item.first_air_date;
  const yearNum = year ? new Date(year).getFullYear() : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const trailer = item.videos?.[0];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img
            src={tmdbApi.getImage(item.backdrop_path || item.poster_path, 'original')}
            alt={title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition">
            <X size={20} className="text-white" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{yearNum}</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{rating}</span>
              <span className="text-gray-500 text-sm">/10</span>
            </div>
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">
              {item.mediaType === 'movie' ? 'Movie' : 'TV Series'}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Synopsis</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {item.overview || 'No synopsis available.'}
            </p>
          </div>
          {item.genres?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {item.genres.map((genre) => (
                  <span key={genre.id} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {trailer && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Trailer</h3>
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe src={`https://www.youtube.com/embed/${trailer.key}`} className="w-full h-full" allowFullScreen />
              </div>
            </div>
          )}
          <button onClick={onClose} className="w-full mt-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MovieFinder() {
  const { isDark, toggleTheme } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    const data = await tmdbApi.getTrending();
    setItems(data.results || []);
    setLoading(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      const data = await tmdbApi.search(query);
      setItems(data.results || []);
      setLoading(false);
    } else {
      fetchTrending();
    }
  };

  const handleCardClick = async (item, mediaType) => {
    const details = await tmdbApi.getDetails(mediaType, item.id);
    const videos = await tmdbApi.getVideos(mediaType, item.id);
    setSelectedItem({ ...details, videos, mediaType });
    setShowModal(true);
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    return type === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎬 ChevaVerse
          </h1>
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎬 ChevaVerse
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Search millions of movies, TV shows, and anime</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search movies, TV shows, anime..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 justify-center mb-6">
          {['all', 'movie', 'tv'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'TV & Anime'}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Found {filteredItems.length} results
        </div>

        {/* Results Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">No results found. Try a different search!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <MovieCard key={item.id} item={item} onClick={handleCardClick} />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}