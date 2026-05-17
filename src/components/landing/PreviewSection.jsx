// src/components/landing/PreviewSection.jsx
import { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { tmdbApi } from '../../services/tmdbApi';

export default function PreviewSection() {
  const [previewMovies, setPreviewMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const data = await tmdbApi.getTrending(1);
        setPreviewMovies(data.results?.slice(0, 3) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadPreview();
  }, []);

  return (
    <section id="preview" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left - Text */}
          <div className="flex-1 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <span className="text-xs font-medium text-cyan-300">PREVIEW</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              See It in
              <span className="gradient-text ml-2">Action</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              ChevaVerse delivers a seamless experience to discover your next favorite movie or anime. 
              With smart search, beautiful cards, and detailed information including trailers and ratings.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Search across movies, TV shows, and anime simultaneously',
                'Filter by type (All/Movies/TV) for precise results',
                'View detailed info including trailers and ratings',
                'Save favorites to your personal watchlist'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => window.location.href = '/app'}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Try it now
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right - Real Movie Posters */}
          <div className="flex-1">
            <div className="relative">
              {/* Mockup Card */}
              <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="bg-gradient-to-r from-cyan-500/10 to-gold-500/10 px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[10px] text-gray-500">ChevaVerse — Trending Now</span>
                  </div>
                </div>
                <div className="p-4">
                  {loading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[2/3] rounded-xl bg-gradient-to-br from-cyan-500/20 to-gold-500/20 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {previewMovies.map((movie) => (
                        <div key={movie.id} className="group cursor-pointer">
                          <img
                            src={tmdbApi.getImage(movie.poster_path, 'w342')}
                            alt={movie.title || movie.name}
                            className="w-full aspect-[2/3] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="mt-1 text-center">
                            <p className="text-[10px] text-gray-500 truncate">
                              {movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}