import { ChevronRight } from 'lucide-react';

const GENRES = [
  { emoji: '⚔️', label: 'Action' },
  { emoji: '🗺️', label: 'Adventure' },
  { emoji: '✨', label: 'Animation' },
  { emoji: '😄', label: 'Comedy' },
  { emoji: '🎭', label: 'Drama' },
  { emoji: '🏰', label: 'Fantasy' },
  { emoji: '👻', label: 'Horror' },
  { emoji: '💕', label: 'Romance' },
  { emoji: '🚀', label: 'Sci-Fi' },
  { emoji: '🔪', label: 'Thriller' },
];

const RELEASES = [
  { day: '24', month: 'MAY', title: 'Demon Slayer', subtitle: 'Hashira Training Arc', type: 'TV', color: 'cyan' },
  { day: '31', month: 'MAY', title: 'The Boys',     subtitle: 'Season 4',             type: 'TV', color: 'cyan' },
  { day: '7',  month: 'JUN', title: 'Haikyuu!!',   subtitle: 'The Dumpster Battle',  type: 'Movie', color: 'gold' },
];

const TAGS = [
  { label: '#MakotoShinkai', active: true },
  { label: '#SummerAnime2024', active: false },
  { label: '#Oppenheimer',  active: false },
  { label: '#DemonSlayer',  active: false },
  { label: '#Romance',      active: false, gold: true },
  { label: '#JujutsuKaisen',active: false },
];

export default function RightSidebar({ onGenreClick }) {
  return (
    <aside className="w-[300px] flex-shrink-0 hidden xl:flex flex-col gap-4 py-5 pr-5 overflow-y-auto scrollbar-hide">
      {/* Genres */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-700 text-white text-[15px]">Explore</h3>
          <button className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            View All Genres
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {GENRES.map((g) => (
            <button
              key={g.label}
              onClick={() => onGenreClick?.(g.label)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 transition-all text-xs font-medium"
            >
              <span className="text-sm">{g.emoji}</span>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Release Calendar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-700 text-white text-[15px]">Release Calendar</h3>
          <button className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            View Full Calendar
          </button>
        </div>
        <div className="space-y-3">
          {RELEASES.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`
                flex-shrink-0 w-10 h-[46px] rounded-xl flex flex-col items-center justify-center
                ${r.color === 'gold'
                  ? 'bg-gold-500/10 border border-gold-500/20'
                  : 'bg-cyan-500/12 border border-cyan-500/20'
                }
              `}>
                <span className={`text-[17px] font-800 font-display leading-none ${r.color === 'gold' ? 'text-gold-300' : 'text-cyan-300'}`}>{r.day}</span>
                <span className={`text-[9px] font-600 mt-0.5 ${r.color === 'gold' ? 'text-gold-500' : 'text-cyan-500'}`}>{r.month}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{r.title}</p>
                <p className="text-[11px] text-gray-500 truncate">{r.subtitle}</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-gray-400 flex-shrink-0">
                {r.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="font-display font-700 text-white text-[15px] mb-3">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t.label}
              className={`
                px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all
                ${t.active
                  ? 'bg-cyan-500/12 border-cyan-500/25 text-cyan-300'
                  : t.gold
                    ? 'bg-gold-500/10 border-gold-500/20 text-gold-300'
                    : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}