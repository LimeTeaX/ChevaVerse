// src/pages/TopRatedPage.jsx
import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import { tmdbApi } from '../services/tmdbApi';
import DetailModal from '../components/movie/DetailModal';
import { Loader2, Award, Tv, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TopRatedPage() {
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [anime, setAnime] = useState([]);

    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingTv, setLoadingTv] = useState(true);
    const [loadingAnime, setLoadingAnime] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Refs untuk scroll horizontal
    const moviesRef = useRef(null);
    const tvRef = useRef(null);
    const animeRef = useRef(null);

    // Scroll functions
    const scrollLeft = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    // Load Top Rated Movies
    useEffect(() => {
        const loadMovies = async () => {
            setLoadingMovies(true);
            try {
                const data = await tmdbApi.getTopRatedMovies(1);
                setMovies(data.results?.slice(0, 20) || []);
            } catch (e) {
                console.error(e);
            }
            setLoadingMovies(false);
        };
        loadMovies();
    }, []);

    // Load Top Rated TV Shows
    useEffect(() => {
        const loadTvShows = async () => {
            setLoadingTv(true);
            try {
                const data = await tmdbApi.getTopRatedTv(1);
                setTvShows(data.results?.slice(0, 20) || []);
            } catch (e) {
                console.error(e);
            }
            setLoadingTv(false);
        };
        loadTvShows();
    }, []);

    // Load Top Rated Animation
    useEffect(() => {
        const loadAnime = async () => {
            setLoadingAnime(true);
            try {
                const data = await tmdbApi.getTVByGenre('Animation', 1);
                const sorted = (data.results || []).sort((a, b) =>
                    (b.vote_average || 0) - (a.vote_average || 0)
                );
                setAnime(sorted.slice(0, 20));
            } catch (e) {
                console.error(e);
            }
            setLoadingAnime(false);
        };
        loadAnime();
    }, []);

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

    // Section Component dengan tombol scroll
    const Section = ({ title, icon, items, loading, mediaType, scrollRef }) => (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="font-display text-xl font-bold text-white">{title}</h2>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                        Top {items.length}
                    </span>
                </div>

                {/* Tombol scroll - muncul kalo ada items */}
                {!loading && items.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => scrollLeft(scrollRef)}
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => scrollRight(scrollRef)}
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-[150px] animate-pulse">
                            <div className="w-full h-[225px] rounded-xl bg-white/5" />
                            <div className="h-3 bg-white/5 rounded mt-2 w-3/4" />
                            <div className="h-2 bg-white/5 rounded mt-1 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative group">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {items.map((item, idx) => (
                            <div key={item.id} className="flex-shrink-0 w-[150px] group/card cursor-pointer">
                                <div className="relative" onClick={() => handleCardClick(item, mediaType)}>
                                    <div className="absolute -left-2 -top-2 z-10 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-gold-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                        {idx + 1}
                                    </div>
                                    <img
                                        src={tmdbApi.getImage(item.poster_path, 'w342')}
                                        alt={item.title || item.name}
                                        className="w-full h-[225px] object-cover rounded-xl transition-all duration-300 group-hover/card:scale-105"
                                        loading="lazy"
                                    />

                                    {/* Rating badge di kanan atas */}
                                    {item.vote_average > 0 && (
                                        <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/10">
                                            <span className="text-yellow-400 text-[10px]">⭐</span>
                                            <span className="text-white text-[10px] font-semibold">{item.vote_average?.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-xs font-semibold text-white line-clamp-1">
                                        {item.title || item.name}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                        {item.first_air_date?.split('-')[0] || item.release_date?.split('-')[0] || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A1628]">
            <Navbar
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery('')}
            />

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold gradient-text">Top Rated</h1>
                    <p className="text-gray-500 text-sm mt-1">Highest rated movies, TV shows, and anime of all time</p>
                </div>

                {/* Section 1: Top Rated Movies */}
                <Section
                    title="Top Rated Movies"
                    icon={<Award size={20} className="text-gold-400" />}
                    items={movies}
                    loading={loadingMovies}
                    mediaType="movie"
                    scrollRef={moviesRef}
                />

                {/* Section 2: Top Rated TV Series */}
                <Section
                    title="Top Rated TV Series"
                    icon={<Tv size={20} className="text-cyan-400" />}
                    items={tvShows}
                    loading={loadingTv}
                    mediaType="tv"
                    scrollRef={tvRef}
                />

                {/* Section 3: Top Rated Animation */}
                <Section
                    title="Top Rated Animation"
                    icon={<Sparkles size={20} className="text-purple-400" />}
                    items={anime}
                    loading={loadingAnime}
                    mediaType="tv"
                    scrollRef={animeRef}
                />
            </div>

            {/* Modal */}
            {showModal && selectedItem && (
                <DetailModal item={selectedItem} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}