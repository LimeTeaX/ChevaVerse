// src/pages/MoviesPage.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from '../components/movie/MovieCard';
import DetailModal from '../components/movie/DetailModal';
import { Loader2, Filter } from 'lucide-react';

// Daftar genre movie dari TMDB
const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

// Sorting options
const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
];

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data;
        
        if (selectedGenre) {
          // Fetch by genre with sorting
          data = await tmdbApi.discoverMovies({
            with_genres: selectedGenre,
            sort_by: sortBy,
            page: page
          });
        } else {
          // Fetch popular movies with sorting
          if (sortBy === 'popularity.desc') {
            data = await tmdbApi.getPopularMovies(page);
          } else if (sortBy === 'vote_average.desc') {
            data = await tmdbApi.getTopRatedMovies(page);
          } else {
            data = await tmdbApi.discoverMovies({
              sort_by: sortBy,
              page: page
            });
          }
        }
        
        if (page === 1) {
          setMovies(data.results || []);
        } else {
          setMovies(prev => [...prev, ...(data.results || [])]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, selectedGenre, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [selectedGenre, sortBy]);

  const handleCardClick = async (item, mediaType) => {
    try {
      const [details, videos] = await Promise.all([
        tmdbApi.getDetails(mediaType, item.id),
        tmdbApi.getVideos(mediaType, item.id),
      ]);
      setSelectedItem({ ...details, videos, mediaType });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedGenre(null);
    setSortBy('popularity.desc');
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              Movies
              {selectedGenre && (
                <span className="text-cyan-400 text-lg ml-2">
                  • {GENRES.find(g => g.id === selectedGenre)?.name}
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {movies.length} movies loaded
            </p>
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <Filter size={16} className="text-cyan-400" />
              <span className="text-sm text-white">Filter & Sort</span>
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-[#0F1A36] border border-white/10 rounded-xl shadow-xl z-20 p-4">
                {/* Sort Options */}
                <div className="mb-4">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500/40 focus:outline-none"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Genre Options */}
                <div className="mb-4">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Genre</label>
                  <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto">
                    {GENRES.map(genre => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreSelect(genre.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedGenre === genre.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedGenre || sortBy !== 'popularity.desc') && (
                  <button
                    onClick={clearFilters}
                    className="w-full mt-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Movies Grid */}
            {movies.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No movies found</p>
                <p className="text-sm mt-2">Try changing your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    item={movie}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {movies.length > 0 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading}
                  className="btn-secondary px-8 py-3 rounded-xl text-sm font-medium hover:bg-cyan-500/20 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  ) : null}
                  {loading ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <DetailModal 
          item={selectedItem} 
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }} 
        />
      )}
    </div>
  );
}