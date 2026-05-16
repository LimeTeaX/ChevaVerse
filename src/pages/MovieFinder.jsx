// src/pages/MovieFinder.jsx
import { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from '../components/movie/MovieCard';
import { Search, X, Sun, Moon, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import { GENRES } from '../utils/constants';

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
  const backdropUrl = tmdbApi.getImage(item.backdrop_path || item.poster_path, 'original');
  const posterUrl = tmdbApi.getImage(item.poster_path, 'w342');
  const runtime = item.runtime ? `${item.runtime} min` : '';
  const status = item.status || '';
  const genres = item.genres || [];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
          <img src={backdropUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-6 md:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 md:w-40 shrink-0 hidden md:block">
              <img src={posterUrl} alt={title} className="w-full rounded-xl shadow-lg" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
              <p className="text-gray-400 text-sm mt-1">{yearNum} • {runtime} • {status}</p>
              <div className="flex items-center gap-2 mt-3">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{rating}</span>
                <span className="text-gray-400 text-sm">/10</span>
              </div>
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {genres.map((genre) => (
                    <span key={genre.id} className="px-2 py-1 bg-gray-800 rounded-lg text-xs">{genre.name}</span>
                  ))}
                </div>
              )}
              <div className="mt-5">
                <h3 className="font-semibold text-lg mb-2">Synopsis</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.overview || 'No synopsis available.'}</p>
              </div>
              {trailer && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">Trailer</h3>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe src={`https://www.youtube.com/embed/${trailer.key}`} title={trailer.name} className="w-full h-full" allowFullScreen />
                  </div>
                </div>
              )}
              <button onClick={onClose} className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition-colors">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition">Prev</button>
      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition">1</button>
          {startPage > 2 && <span className="px-2 py-2">...</span>}
        </>
      )}
      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-2 rounded-lg transition ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>{page}</button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 py-2">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition">{totalPages}</button>
        </>
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition">Next</button>
    </div>
  );
}

export default function MovieFinder() {
  const { isDark, toggleTheme } = useTheme();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedGenreName, setSelectedGenreName] = useState('');
  const [genreList, setGenreList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  // Load genres
  useEffect(() => {
    const loadGenres = async () => {
      const movieGenres = Object.entries(GENRES.movie).map(([id, name]) => ({ id: parseInt(id), name, type: 'movie' }));
      const tvGenres = Object.entries(GENRES.tv).map(([id, name]) => ({ id: parseInt(id), name, type: 'tv' }));
      setGenreList([...movieGenres, ...tvGenres].slice(0, 16));
    };
    loadGenres();
  }, []);

  const fetchData = async (page = 1) => {
    setLoading(true);
    let data;
    
    if (searchQuery) {
      data = await tmdbApi.search(searchQuery, page);
    } else if (selectedGenre) {
      const mediaType = filter === 'movie' ? 'movie' : 'tv';
      data = await tmdbApi.getByGenre(mediaType, selectedGenre, selectedGenreName, page);
    } else {
      data = await tmdbApi.getTrending(page);
    }
    
    let results = data.results || [];
    
    if (filter !== 'all' && !selectedGenre) {
      const mediaType = filter === 'movie' ? 'movie' : 'tv';
      results = results.filter(item => {
        const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
        return type === mediaType;
      });
    }
    
    setItems(results);
    setTotalPages(data.total_pages || 0);
    setTotalResults(data.total_results || 0);
    setCurrentPage(page);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1);
  }, [filter, searchQuery, selectedGenre]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre(null);
    setSelectedGenreName('');
    setCurrentPage(1);
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre.id);
    setSelectedGenreName(genre.name);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleCardClick = async (item, mediaType) => {
    const details = await tmdbApi.getDetails(mediaType, item.id);
    const videos = await tmdbApi.getVideos(mediaType, item.id);
    setSelectedItem({ ...details, videos, mediaType });
    setShowModal(true);
  };

  const clearGenreFilter = () => {
    setSelectedGenre(null);
    setSelectedGenreName('');
    fetchData(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🎬 ChevaVerse</h1>
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🎬 ChevaVerse</h1>
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

        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            onClick={clearGenreFilter}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${!selectedGenre ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            All Genres
          </button>
          {genreList.slice(0, 16).map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreFilter(genre)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selectedGenre === genre.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Type Filter (All/Movies/TV) */}
        <div className="flex gap-2 justify-center mb-6">
          {['all', 'movie', 'tv'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'TV & Anime'}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Found {items.length} results • Page {currentPage} of {totalPages}
          {selectedGenre && <span className="ml-2">• Genre: {selectedGenreName}</span>}
          {searchQuery && <span className="ml-2">• Searching: "{searchQuery}"</span>}
        </div>

        {/* Results Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">
              {selectedGenre ? `No results found for ${selectedGenreName} genre.` : 'No results found. Try a different search!'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {items.map((item) => (
                <MovieCard key={item.id} item={item} onClick={handleCardClick} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                fetchData(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && <DetailModal item={selectedItem} onClose={() => setShowModal(false)} />}
    </div>
  );
}