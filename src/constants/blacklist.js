// src/constants/blacklist.js

export const ADULT_CONTENT_BLACKLIST = [
  // Anime dewasa (yang gak di-flag adult di TMDB)
  'overflow',
  'redo of healer',
  'highschool dxd',
  'high school dxd',
  'testament of sister new devil',
  'interspecies reviewers',
  'kiss x sis',
  'to love ru',
  'prison school',
  'shimoneta',
  'valkyrie drive',
  'queens blade',
  'seikon no qwaser',
  'manyuu hikenchou',
  'ikenai borderline',
  'yuuna and the haunted hot springs',
  'peter grill',
  'mother of the goddess dormitory',
  'immoral guild',
  'worlds end harem',
  'why the hell are you here teacher',
  'ayanashi triangle',
  'maken ki',
  'sekirei',
  'freezing',
  'hyakka ryouran',
  'queens blade',
  'sora no otoshimono',
  'dakara boku wa h ga dekinai',
  'shinmai maou no testament',
  'masou gakuen hxh',
  'rakudai kishi no cavalry',
  'trinity seven',
  'date a live',
  'infinite stratos',
  'campione',
  'highschool of the dead',
  'btooom',
  'goblin slayer',
  'berserk',
  'devilman crybaby',
  'elven lied',
];

// Fungsi filter untuk ngecek apakah judul termasuk blacklist
export const isAdultContent = (title) => {
  if (!title) return false;
  const lowerTitle = title.toLowerCase();
  return ADULT_CONTENT_BLACKLIST.some(bad => lowerTitle.includes(bad.toLowerCase()));
};

// Optional: filter array hasil dari API
export const filterAdultContent = (items) => {
  if (!items || !Array.isArray(items)) return [];
  return items.filter(item => !isAdultContent(item.title || item.name));
};