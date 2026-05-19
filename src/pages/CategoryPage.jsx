// src/pages/CategoryPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import MovieCard from '../components/movie/MovieCard';
import DetailModal from '../components/movie/DetailModal';
import { tmdbApi } from '../services/tmdbApi';
import { Loader2, ArrowLeft } from 'lucide-react';
import { filterAdultContent } from '../constants/blacklist';

export default function CategoryPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mapping type ke API function
  const getTitle = () => {
    switch (type) {
      case 'trending': return 'Trending Now';
      case 'top-rated': return 'Top Rated';
      case 'now-playing': return 'Now Playing';
      case 'anime-spotlight': return 'Anime Spotlight';
      case 'animation-movies': return 'Animation Movies';
      default: return 'Movies';
    }
  };

  const fetchData = async (pageNum) => {
    try {
      let data;
      switch (type) {
        case 'trending':
          data = await tmdbApi.getTrending(pageNum);
          break;
        case 'top-rated':
          data = await tmdbApi.getTopRatedMovies(pageNum);
          break;
        case 'now-playing':
          data = await tmdbApi.getNowPlayingMovies(pageNum);
          break;
        case 'anime-spotlight':
          data = await tmdbApi.getTVByGenre('Animation', pageNum);
          break;
        case 'animation-movies':
          data = await tmdbApi.getMoviesByGenre(16, pageNum);
          break;
        default:
          data = { results: [] };
      }
      return data.results || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      const results = await fetchData(1);
      const filteredResults = filterAdultContent(results);
      setItems(filteredResults);
      setHasMore(results.length >= 20);
      setLoading(false);
    };
    loadItems();
  }, [type]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);

    try {
      const newItemsRaw = await fetchData(nextPage);

      const combinedItems = [...items, ...newItemsRaw];

      const uniqueItems = Array.from(
        new Map(combinedItems.map(item => [item.id, item])).values()
      );

      setItems(uniqueItems);
      setPage(nextPage);
      setHasMore(newItemsRaw.length >= 20);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (item, mediaType) => {
    try {
      const [details, videos] = await Promise.all([
        tmdbApi.getDetails(mediaType, item.id),
        tmdbApi.getVideos(mediaType, item.id),
      ]);
      setSelectedItem({ ...details, videos, mediaType });
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
          {getTitle()}
        </h1>

        {loading && items.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {items.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-secondary px-8 py-3 rounded-xl text-sm font-medium hover:bg-cyan-500/20 transition-all"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}