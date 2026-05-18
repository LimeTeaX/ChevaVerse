// src/services/tmdbApi.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const tmdbApi = {
  // ==================== SEARCH ====================
  search: async (query, page = 1) => {
    const res = await api.get('/search/multi', { params: { query, page } });
    return res.data;
  },

  // ==================== TRENDING ====================
  getTrending: async (page = 1) => {
    const res = await api.get('/trending/all/week', { params: { page } });
    return res.data;
  },

  // ==================== DETAILS ====================
  getDetails: async (mediaType, id) => {
    const res = await api.get(`/${mediaType}/${id}`);
    return res.data;
  },

  getVideos: async (mediaType, id) => {
    const res = await api.get(`/${mediaType}/${id}/videos`);
    return res.data.results.filter(v => v.type === 'Trailer' && v.site === 'YouTube');
  },

  // ==================== IMAGE ====================
  getImage: (path, size = 'w342') => {
    if (!path) {
      return 'https://placehold.co/500x750/0F1A36/22D3EE?text=No+Poster';
    }
    return `${IMAGE_URL}/${size}${path}`;
  },

  // ==================== DISCOVER / GENRE ====================
  getMoviesByGenre: async (genreId, page = 1) => {
    const res = await api.get('/discover/movie', {
      params: { with_genres: genreId, page }
    });
    return res.data;
  },

  getTVByGenre: async (genreName, page = 1) => {
    const tvGenreMapping = {
      'Action': 10759,
      'Adventure': 10759,
      'Animation': 16,
      'Comedy': 35,
      'Crime': 80,
      'Documentary': 99,
      'Drama': 18,
      'Family': 10751,
      'Fantasy': 10765,
      'History': 10768,
      'Horror': 27,
      'Music': 10402,
      'Mystery': 9648,
      'Romance': 10749,
      'Sci-Fi': 10765,
      'Thriller': 53,
      'War': 10768,
      'Western': 37,
    };

    const tvGenreId = tvGenreMapping[genreName] || 10759;
    const res = await api.get('/discover/tv', {
      params: { with_genres: tvGenreId, page }
    });
    return res.data;
  },

  getByGenre: async (mediaType, genreId, genreName, page = 1) => {
    if (mediaType === 'tv') {
      return tmdbApi.getTVByGenre(genreName, page);
    }
    return tmdbApi.getMoviesByGenre(genreId, page);
  },

  // ==================== TOP RATED (BENERAN) ====================
  getTopRatedMovies: async (page = 1) => {
    const res = await api.get('/movie/top_rated', { params: { page } });
    return res.data;
  },

  getTopRatedTv: async (page = 1) => {
    const res = await api.get('/tv/top_rated', { params: { page } });
    return res.data;
  },

  // ==================== TOP RATED PER GENRE (SORT BY RATING) ====================
  getTopRatedMoviesByGenre: async (genreId, page = 1, minVotes = 100) => {
    const res = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'vote_average.desc',
        'vote_count.gte': minVotes
      }
    });
    return res.data;
  },

  getTopRatedTvByGenre: async (genreId, page = 1, minVotes = 100) => {
    const res = await api.get('/discover/tv', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'vote_average.desc',
        'vote_count.gte': minVotes
      }
    });
    return res.data;
  },

  // ==================== UPCOMING ====================
  getUpcomingMovies: async (page = 1) => {
    const res = await api.get('/movie/upcoming', { params: { page } });
    return res.data;
  },

  getUpcomingTv: async (page = 1) => {
    const res = await api.get('/tv/on_the_air', { params: { page } });
    return res.data;
  },

  // ==================== NOW PLAYING ====================
  getNowPlayingMovies: async (page = 1) => {
    const res = await api.get('/movie/now_playing', { params: { page } });
    return res.data;
  },

  getAiringTodayTv: async (page = 1) => {
    const res = await api.get('/tv/airing_today', { params: { page } });
    return res.data;
  },

  // ==================== POPULAR ====================
  getPopularMovies: async (page = 1) => {
    const res = await api.get('/movie/popular', { params: { page } });
    return res.data;
  },

  getPopularTv: async (page = 1) => {
    const res = await api.get('/tv/popular', { params: { page } });
    return res.data;
  },

  // ==================== RECOMMENDATIONS ====================
  getRecommendations: async (mediaType, id, page = 1) => {
    const res = await api.get(`/${mediaType}/${id}/recommendations`, { params: { page } });
    return res.data;
  },

  // ==================== SIMILAR ====================
  getSimilar: async (mediaType, id, page = 1) => {
    const res = await api.get(`/${mediaType}/${id}/similar`, { params: { page } });
    return res.data;
  },

  // ==================== DISCOVER WITH SORT ====================
  discoverMovies: async (params = {}) => {
    const res = await api.get('/discover/movie', { params });
    return res.data;
  },

  discoverTv: async (params = {}) => {
    const res = await api.get('/discover/tv', { params });
    return res.data;
  },

  // ==================== NOW PLAYING ====================
  getNowPlayingMovies: async (page = 1) => {
    const res = await api.get('/movie/now_playing', { params: { page } });
    return res.data;
  },
};

export default tmdbApi;