// src/pages/AnimePage.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from '../components/movie/MovieCard';
import DetailModal from '../components/movie/DetailModal';
import { Loader2 } from 'lucide-react';

export default function AnimePage() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadAnime = async () => {
      setLoading(true);
      try {
        const data = await tmdbApi.getTVByGenre('Animation', page);
        setAnime(prev => page === 1 ? data.results : [...prev, ...data.results]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    loadAnime();
  }, [page]);

  const handleCardClick = async (item, mediaType) => {
    try {
      const [details, videos] = await Promise.all([
        tmdbApi.getDetails(mediaType, item.id),
        tmdbApi.getVideos(mediaType, item.id),
      ]);
      setSelectedItem({ ...details, videos, mediaType });
      setShowModal(true);
    } catch (e) {
      console.error(e);
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
        <h1 className="font-display text-2xl font-bold text-white mb-6">Anime</h1>
        
        {loading && page === 1 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {anime.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  onClick={handleCardClick}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
                className="btn-secondary px-6 py-2 rounded-xl text-sm font-medium"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}