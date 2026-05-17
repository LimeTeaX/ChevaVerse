// src/components/landing/HeroSection.jsx
import { Play, TrendingUp, Star, Film } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-gold-500/5" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <TrendingUp size={14} className="text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">#1 Movie & Anime Finder</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Find Your Next{' '}
            <span className="gradient-text">Favorite Movie</span>
            <br />
            & Anime
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
            Discover thousands of movies, TV shows, and anime. 
            Search, filter, and create your watchlist — all in one place, completely free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={() => window.location.href = '/app'}
              className="btn-primary px-8 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              Start Exploring
              <span className="text-lg">→</span>
            </button>
            <button
              onClick={() => {
                document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary px-8 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              <Play size={18} />
              Watch Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-cyan-400">10K+</p>
              <p className="text-xs text-gray-500 mt-1">Movies & Anime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-cyan-400">500+</p>
              <p className="text-xs text-gray-500 mt-1">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <p className="text-3xl md:text-4xl font-bold text-gold-400">4.8</p>
                <Star size={20} className="text-gold-400 fill-gold-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">User Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}