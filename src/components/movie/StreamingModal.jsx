// src/components/movie/StreamingModal.jsx
import { X, ExternalLink } from 'lucide-react';
import { tmdbApi } from '../../services/tmdbApi';
import { useState, useEffect } from 'react';

export default function StreamingModal({ item, onClose }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const mediaType = item.mediaType || (item.first_air_date ? 'tv' : 'movie');
        const data = await tmdbApi.getWatchProviders(mediaType, item.id);
        
        // Ambil provider untuk region Indonesia (ID) atau US sebagai fallback
        const regionData = data.results?.ID || data.results?.US || {};
        const flatrate = regionData.flatrate || [];
        const rent = regionData.rent || [];
        const buy = regionData.buy || [];
        
        setProviders([...flatrate, ...rent, ...buy]);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProviders();
  }, [item]);

  const title = item.title || item.name;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full rounded-2xl bg-[#0F1A36] border border-white/[0.08] shadow-2xl animate-fadeInScale overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-display font-bold text-white text-lg">
            Watch {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No streaming providers found</p>
              <p className="text-gray-600 text-xs mt-2">Try checking Google for availability</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-2">Available on:</p>
              {providers.map((provider) => (
                <a
                  key={provider.provider_id}
                  href={`https://www.google.com/search?q=${encodeURIComponent(title + " " + provider.provider_name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {provider.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-8 h-8 rounded-lg"
                      />
                    )}
                    <span className="text-white text-sm font-medium">
                      {provider.provider_name}
                    </span>
                  </div>
                  <ExternalLink size={14} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.06] bg-white/5">
          <p className="text-[10px] text-gray-600 text-center">
            Availability may vary by region
          </p>
        </div>
      </div>
    </div>
  );
}