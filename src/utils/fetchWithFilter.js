// src/utils/fetchWithFilter.js
import { filterAdultContent } from '../constants/blacklist';

export const fetchWithFilter = async (apiCall, ...args) => {
  const data = await apiCall(...args);
  return {
    ...data,
    results: filterAdultContent(data.results || [])
  };
};