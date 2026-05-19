// src/constants/blacklist.js

// Blacklist berdasarkan ID (lebih akurat!)
export const ADULT_CONTENT_BLACKLIST_IDS = [
  95897, // Overflow
  207840, // Harem Camp!
  233643,    // Secret Mission - Undercover Agents Never Back Down!
  81044,    // Joshiochi! 2-kai kara Onnanoko ga... Futtekita!?
  113360,    // Jimihen!! Jimiko o Kae Chau Jun Isei Kouyuu
  88090,    // Araiya-san! Ore to Aitsu ga Onnayu de!?
  288577,    // Room of Guilty Pleasure
  249891,    // Yoasobi Gurashi!
  118824,    // Everything for Demon King Evelogia
  279120,    // The Share House's Secret Rule
  75778,    // 25-Year-Old High School Girl, I Wouldn’t Do This with a Kid
  157879,    // 3 Seconds Later, He Turned into a Beast
  306901,    // 300 Yen no Otsukiai
  1261020,  // Amakano
  78501,   // Sweet Punishment: I'm the Guard's Personal Pet
  291414,   // Does It Count If You Lose Your Innocence to an Android?
  287973,  // Ren Arisugawa Is Actually a Girl
  1511481, // Bible Black
  2531981, // Eve-Marie Brandish
  292554,  // Marry Me, Let's Have a Baby!
  105903,   // Eternity Shinya no Nurekoi Channel
  1638220,   // euphoria (hentong edition)
  1209352,   // Hitozuma Life: One Time Gal
  283884,   // Chuhai Lips: Canned Flavor of Married Women
  300015,   // Ichigo Aika: Strawberry Elegy
  765056,   // My Sister's Idol Trainee Friends
  1568960,  // ImaRia
  302515,   // Isekai Harem Monogatari
  1259471,  // Jewelry the Animation
  118588,   // Seduced by My Best Friend
  241002,   // Adam's Sweet Agony
  320212,   // Natsu to Hako
  106342,   // I Want to Be His Prey!
  100937,   // Crazy Over His Fingers: Just the Two of Us in a Salon After Closing
  
  // Tambahin ID lain di sini
];

// Fungsi filter yang menerima item (bisa object atau langsung ID)
export const isAdultContent = (item) => {
  if (!item) return false;
  
  // Kalo item berupa object, ambil id-nya
  const itemId = typeof item === 'object' ? item.id : item;
  const itemTitle = typeof item === 'object' ? (item.title || item.name || '').toLowerCase() : '';
  
  // Cek berdasarkan ID
  if (ADULT_CONTENT_BLACKLIST_IDS.includes(itemId)) {
    return true;
  }
  
};

export const filterAdultContent = (items) => {
  if (!items || !Array.isArray(items)) return [];
  return items.filter(item => !isAdultContent(item));
};