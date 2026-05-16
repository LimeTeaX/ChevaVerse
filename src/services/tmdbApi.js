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
  search: async (query, page = 1) => {
    const res = await api.get('/search/multi', { params: { query, page } });
    return res.data;
  },
  getTrending: async (page = 1) => {
    const res = await api.get('/trending/all/week', { params: { page } });
    return res.data;
  },
  getDetails: async (mediaType, id) => {
    const res = await api.get(`/${mediaType}/${id}`);
    return res.data;
  },
  getVideos: async (mediaType, id) => {
    const res = await api.get(`/${mediaType}/${id}/videos`);
    return res.data.results.filter(v => v.type === 'Trailer' && v.site === 'YouTube');
  },
  getImage: (path, size = 'w342') => {
    if (!path) return 'https://placehold.co/500x750?text=No+Poster';
    return `${IMAGE_URL}/${size}${path}`;
  },
  
  // Discover movies by genre
  getMoviesByGenre: async (genreId, page = 1) => {
    const res = await api.get('/discover/movie', {
      params: { with_genres: genreId, page }
    });
    return res.data;
  },
  
  // Discover TV shows by genre (dengan mapping ID yang bener)
  getTVByGenre: async (genreName, page = 1) => {
    // Mapping nama genre ke ID TV Series yang bener
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
  
  // Universal get by genre (otomatis pilih movie/tv)
  getByGenre: async (mediaType, genreId, genreName, page = 1) => {
    if (mediaType === 'tv') {
      return tmdbApi.getTVByGenre(genreName, page);
    }
    return tmdbApi.getMoviesByGenre(genreId, page);
  },
};