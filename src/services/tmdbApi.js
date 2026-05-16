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
};