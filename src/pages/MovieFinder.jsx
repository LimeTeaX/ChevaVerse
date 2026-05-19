// src/pages/MovieFinder.jsx
import { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import HeroSection from '../components/movie/HeroSection';
import MovieRow from '../components/movie/MovieRow';
import DetailModal from '../components/movie/DetailModal';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { filterAdultContent } from '../constants/blacklist';

const TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'movie', label: 'Movies' },
  { key: 'tv', label: 'TV & Anime' },
];

function SearchResultsGrid({ items, onCardClick, loading }) {
  const filteredItems = filterAdultContent(items);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-fadeInUp">
            <div className="rounded-[20px] bg-white/[0.05] aspect-[2/3] skeleton-shimmer" />
            <div className="h-3 bg-white/[0.05] rounded mt-3 w-3/4 skeleton-shimmer" />
            <div className="h-2.5 bg-white/[0.05] rounded mt-1.5 w-1/2 skeleton-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <Search size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-display font-600">No results found</p>
        <p className="text-sm mt-1">Try a different keyword or genre</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {filteredItems.map((item) => {
        const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
        const title = item.title || item.name;
        return (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => onCardClick(item, mediaType)}
          >
            <div className="relative overflow-hidden rounded-[20px] bg-[#0F1A36] movie-card-hover">
              <img
                src={tmdbApi.getImage(item.poster_path, 'w342')}
                alt={title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-2.5 px-0.5">
              <h3 className="font-display font-600 text-[13px] text-white line-clamp-1">{title}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {item.vote_average ? `⭐ ${item.vote_average.toFixed(1)}` : ''}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MovieFinder({ searchQuery, onSearchChange }) {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [trending, setTrending] = useState([]);
  const [anime, setAnime] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [loadingHome, setLoadingHome] = useState(true);

  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [filter, setFilter] = useState('all');

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const isSearching = !!searchQuery;

  // Load homepage data
  useEffect(() => {
    if (isSearching) return;
    const load = async () => {
      setLoadingHome(true);
      try {
        const [nowData, trendData, animeData, topData, animationData] = await Promise.all([
          tmdbApi.getNowPlayingMovies(1),
          tmdbApi.getTrending(1),
          tmdbApi.getTVByGenre('Animation', 1),
          tmdbApi.getTopRatedMovies(1),
          tmdbApi.getMoviesByGenre(16, 1),
        ]);

        setNowPlaying(filterAdultContent(nowData.results)?.slice(0, 14) || []);
        setTrending(filterAdultContent(trendData.results)?.slice(0, 14) || []);
        setAnime(filterAdultContent(animeData.results)?.slice(0, 14) || []);
        setTopRated(filterAdultContent(topData.results)?.slice(0, 14) || []);
        setAnimationMovies(filterAdultContent(animationData.results)?.slice(0, 14) || []);
      } catch (e) {
        console.error(e);
      }
      setLoadingHome(false);
    };
    load();
  }, [isSearching]);

  // Search
  useEffect(() => {
    if (!isSearching) return;
    const debounce = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const data = await tmdbApi.search(searchQuery);
        let results = data.results || [];
        if (filter !== 'all') {
          results = results.filter((item) => {
            const t = item.media_type || (item.first_air_date ? 'tv' : 'movie');
            return t === filter;
          });
        }
        setSearchResults(results);
      } catch (e) {
        console.error(e);
      }
      setLoadingSearch(false);
    }, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery, filter]);

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
    <div className="flex-1 min-w-0">
      {isSearching ? (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-700 text-xl text-white">
                Search Results
                <span className="gradient-text ml-2">"{searchQuery}"</span>
              </h2>
              <p className="text-[12px] text-gray-500 mt-0.5">{searchResults.length} results found</p>
            </div>
            <div className="flex items-center gap-2">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all border ${filter === f.key
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-transparent'
                    : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <SearchResultsGrid items={searchResults} onCardClick={handleCardClick} loading={loadingSearch} />
        </div>
      ) : (
        <div>
          <HeroSection onCardClick={handleCardClick} />
          <MovieRow
            title="Now Playing"
            items={nowPlaying}
            onCardClick={handleCardClick}
            loading={loadingHome}
          />
          <MovieRow
            title="Trending Now"
            items={trending}
            onCardClick={handleCardClick}
            loading={loadingHome}
          />
          <MovieRow
            title="Anime Spotlight"
            items={anime}
            onCardClick={handleCardClick}
            loading={loadingHome}
          />
          <MovieRow
            title="Top Rated"
            items={topRated}
            onCardClick={handleCardClick}
            showRank
            loading={loadingHome}
          />
          <MovieRow
            title="Animation Movies"
            items={animationMovies}
            onCardClick={handleCardClick}
            loading={loadingHome}
          />
        </div>
      )}

      {showModal && selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}