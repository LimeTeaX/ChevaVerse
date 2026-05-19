// scripts/scan-adult-anime.js
import { tmdbApi } from '../src/services/tmdbApi.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keyword buat deteksi konten dewasa (bisa lo tambahin)
const ADULT_KEYWORDS = [
  'ecchi', 'hentai', 'harem', 'fan service',
  'overflow', 'redo of healer', 'highschool dxd',
  'kiss x sis', 'to love ru', 'prison school',
  'shimoneta', 'valkyrie drive', 'queens blade',
  'seikon no qwaser', 'manyuu hikenchou',
  'yuuna', 'peter grill', 'immoral guild',
  'worlds end harem', 'ayanashi triangle'
];

// Kata kunci yang AMAN (biar gak kena false positive)
const SAFE_KEYWORDS = [
  'high school musical', 'love live', 'school days', 'the high note'
];

const isAdultByTitle = (title) => {
  if (!title) return false;
  const lowerTitle = title.toLowerCase();
  
  // Cek whitelist dulu
  if (SAFE_KEYWORDS.some(safe => lowerTitle.includes(safe))) {
    return false;
  }
  
  // Cek blacklist keywords
  return ADULT_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
};

const scanAnime = async () => {
  console.log('🔍 Scanning anime for adult content...\n');
  
  let allAnime = [];
  let adultIds = [];
  
  // Scan 5 halaman pertama (cukup buat dapetin yang populer)
  for (let page = 1; page <= 5; page++) {
    try {
      const data = await tmdbApi.getTVByGenre('Animation', page);
      const results = data.results || [];
      allAnime.push(...results);
      console.log(`✅ Page ${page}: ${results.length} anime found`);
    } catch (error) {
      console.error(`❌ Error on page ${page}:`, error);
    }
  }
  
  console.log(`\n📊 Total anime scanned: ${allAnime.length}\n`);
  console.log('🔎 Filtering adult content...\n');
  
  // Filter berdasarkan judul
  allAnime.forEach(anime => {
    const title = anime.name || anime.title;
    if (isAdultByTitle(title)) {
      adultIds.push({
        id: anime.id,
        title: title,
        vote_average: anime.vote_average,
        popularity: anime.popularity
      });
      console.log(`⚠️  POTENTIAL ADULT: ${title} (ID: ${anime.id})`);
    }
  });
  
  // Urutkan berdasarkan popularity
  adultIds.sort((a, b) => b.popularity - a.popularity);
  
  // Simpan ke file
  const outputPath = path.join(__dirname, '../adult-anime-ids.json');
  fs.writeFileSync(outputPath, JSON.stringify(adultIds, null, 2));
  
  console.log(`\n✅ ${adultIds.length} potential adult anime found!`);
  console.log(`📁 Saved to: adult-anime-ids.json`);
  console.log('\n📋 Copy these IDs to blacklist.js:\n');
  console.log(adultIds.map(a => `  ${a.id}, // ${a.title}`).join('\n'));
};

scanAnime();