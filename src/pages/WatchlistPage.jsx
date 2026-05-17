import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import MovieCard from '../components/movie/MovieCard';
import DetailModal from '../components/movie/DetailModal';
import { Bookmark, Trash2, Play } from 'lucide-react';
import { tmdbApi } from '../services/tmdbApi';

export default function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

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

  const removeFromWatchlist = (id) => {
    const newWatchlist = watchlist.filter(w => w.id !== id);
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  };

  const clearAll = () => {
    setWatchlist([]);
    localStorage.removeItem('watchlist');
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Bookmark size={28} className="text-cyan-400" />
              My Watchlist
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {watchlist.length} item{watchlist.length !== 1 ? 's' : ''} to watch
            </p>
          </div>
          
          {watchlist.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Bookmark size={64} className="mb-4 opacity-30" />
            <p className="text-lg font-display">Your watchlist is empty</p>
            <p className="text-sm mt-1">Save movies or anime to watch later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((item) => (
              <div key={item.id} className="relative group">
                <MovieCard
                  item={item}
                  onClick={handleCardClick}
                />
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                >
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}