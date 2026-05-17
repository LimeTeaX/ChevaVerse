// src/components/landing/FeaturesSection.jsx
import { Search, Heart, LayoutGrid, Zap, Star, Shield } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Search movies, TV shows, and anime with intelligent filtering by genre, rating, and year.',
    color: 'cyan'
  },
  {
    icon: Heart,
    title: 'Personal Watchlist',
    desc: 'Save your favorites and create custom playlists to never lose track of what to watch.',
    color: 'gold'
  },
  {
    icon: LayoutGrid,
    title: 'Beautiful Interface',
    desc: 'Clean, modern design with smooth animations and responsive layout for all devices.',
    color: 'cyan'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Built with React + Vite for instant search results and buttery smooth performance.',
    color: 'cyan'
  },
  {
    icon: Star,
    title: 'Top Rated Content',
    desc: 'Discover the best-rated movies and anime curated from TMDB database.',
    color: 'gold'
  },
  {
    icon: Shield,
    title: '100% Free',
    desc: 'No subscriptions, no hidden fees. Enjoy unlimited access to our entire catalog.',
    color: 'cyan'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#0F1A36]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need
            <span className="gradient-text ml-2">in One Place</span>
          </h2>
          <p className="text-gray-400">
            Powerful features to help you discover and organize your next watch
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 group"
            >
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4
                ${feature.color === 'cyan' 
                  ? 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20' 
                  : 'bg-gold-500/10 text-gold-400 group-hover:bg-gold-500/20'
                }
                transition-all
              `}>
                <feature.icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-white text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}