import { useState, useMemo } from "react";
import { Search, Heart, RefreshCw, Sparkles, History, PlayCircle, Trophy } from "lucide-react";
import { Channel } from "../types";

interface ChannelGridProps {
  channels: Channel[];
  loading: boolean;
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  recentlyWatched: Channel[];
  onRefreshPlayback: () => void;
}

const CATEGORIES = [
  "ALL CHANNELS",
  "Sports",
  "Cricket",
  "Football",
  "Bangla TV",
  "News",
  "Movies",
  "Entertainment",
  "Kids",
  "Music",
  "International"
];

export default function ChannelGrid({
  channels,
  loading,
  selectedChannel,
  onSelectChannel,
  favorites,
  onToggleFavorite,
  recentlyWatched,
  onRefreshPlayback,
}: ChannelGridProps) {
  const [activeCategory, setActiveCategory] = useState("ALL CHANNELS");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter channels based on Search and Selected Category
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      const matchSearch =
        ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.rawGroup.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeCategory === "ALL CHANNELS") return matchSearch;
      return ch.category === activeCategory && matchSearch;
    });
  }, [channels, activeCategory, searchQuery]);

  // Favorite channels mapping list
  const favoriteChannels = useMemo(() => {
    return channels.filter((ch) => favorites.includes(ch.id));
  }, [channels, favorites]);

  return (
    <div className="w-full space-y-8">
      
      {/* 1. Search Bar */}
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="absolute top-0 right-0 w-48 h-12 bg-red-600/5 rounded-full filter blur-3xl pointer-events-none" />
        
        {/* Live Search Input Box */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search channels, leagues, networks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-zinc-500 text-sm rounded-2xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition shadow-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white bg-white/10 px-2 py-1 rounded-lg transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2. Recently Watched Strip */}
      {recentlyWatched.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <History className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold">Recently Watched Streams</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recentlyWatched.map((ch) => (
              <button
                key={`recent-${ch.id}`}
                onClick={() => onSelectChannel(ch)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition text-left ${
                  selectedChannel?.id === ch.id
                    ? "bg-red-950/40 border-red-600 text-white"
                    : "bg-white/5 border border-white/5 text-zinc-400 hover:border-white/20 hover:text-white backdrop-blur-sm"
                }`}
              >
                <div className="w-8 h-8 rounded bg-zinc-900 overflow-hidden flex-shrink-0 p-0.5">
                  <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold truncate leading-none mb-1">{ch.name}</p>
                  <p className="text-[9px] font-mono uppercase opacity-75 truncate">{ch.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Favorites List Slider */}
      {favoriteChannels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-500">
              <Heart className="w-4 h-4 fill-rose-500" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold">My Saved Channels ({favoriteChannels.length})</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {favoriteChannels.map((ch) => (
              <div
                key={`fav-${ch.id}`}
                className="group relative bg-white/5 border border-white/5 hover:border-red-600/50 rounded-xl p-3 flex flex-col justify-between aspect-square transition duration-300 transform hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm"
              >
                <button
                  onClick={() => onSelectChannel(ch)}
                  className="flex-1 w-full flex flex-col items-center justify-center text-center space-y-2"
                >
                  <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 flex items-center justify-center">
                    <img src={ch.logo} alt={ch.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="text-xs font-display font-medium text-zinc-200 line-clamp-1 group-hover:text-white">{ch.name}</h4>
                </button>
                <button
                  onClick={() => onToggleFavorite(ch.id)}
                  className="absolute top-2 right-2 text-rose-500 hover:scale-110 active:scale-95 transition"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* 5. Channel Catalog & Categories Filter */}
      <div className="space-y-6">
        <div className="border-b border-zinc-900 pb-2">
          {/* Scrollable Horizontal Navbar */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4 scroll-smooth">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-display font-medium text-xs whitespace-nowrap tracking-wide transition transform active:scale-95 duration-100 ${
                  activeCategory === cat
                    ? "bg-red-600 text-white neon-glow-red font-semibold"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                {cat === "ALL CHANNELS" && "🌐 "}
                {cat === "Sports" && "⚽ "}
                {cat === "Cricket" && "🏏 "}
                {cat === "Football" && "🥅 "}
                {cat === "Bangla TV" && "🇧🇩 "}
                {cat === "News" && "📰 "}
                {cat === "Movies" && "🎬 "}
                {cat === "Kids" && "👶 "}
                {cat === "Music" && "🎵 "}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3 animate-pulse"
              >
                <div className="w-12 h-12 bg-zinc-800 rounded mx-auto" />
                <div className="h-3 bg-zinc-800 rounded w-3/4 mx-auto" />
                <div className="h-2.5 bg-zinc-950 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredChannels.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#070707] border border-zinc-900 rounded-xl">
            <Trophy className="w-12 h-12 text-zinc-600 animate-bounce mb-3" />
            <p className="text-zinc-200 font-display font-semibold">No channels matches search Criteria</p>
            <p className="text-zinc-500 text-xs mt-1">Try changing categories or search descriptors</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredChannels.map((ch) => {
              const isSelected = selectedChannel?.id === ch.id;
              const isFav = favorites.includes(ch.id);

              return (
                <div
                  key={ch.id}
                  className={`group relative bg-white/5 border rounded-xl p-4 text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between backdrop-blur-sm ${
                    isSelected
                      ? "border-red-650 bg-red-950/40 shadow-red-950/20"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  {/* Floating Action elements */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 z-15">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    <span className="bg-red-950 border border-red-700/80 text-red-500 font-mono font-bold text-[8px] px-1 rounded uppercase tracking-wider">
                      LIVE
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(ch.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-zinc-900 transition text-zinc-500 hover:text-rose-500 z-20"
                  >
                    <Heart className={`w-3.5 h-3.5 transition-transform active:scale-95 ${isFav ? "fill-rose-500 text-rose-500 scale-110" : "text-zinc-500"}`} />
                  </button>

                  {/* Main clicking element to play channel */}
                  <div
                    onClick={() => onSelectChannel(ch)}
                    className="flex-1 flex flex-col items-center justify-center space-y-3 mt-4"
                  >
                    <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                      <img
                        src={ch.logo}
                        alt={ch.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://img.icons8.com/neon/96/football.png";
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div>
                      <h4 className="text-zinc-200 font-display font-medium text-xs leading-tight group-hover:text-white line-clamp-2 px-1">
                        {ch.name}
                      </h4>
                      <p className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                        {ch.rawGroup || "TV Streaming"}
                      </p>
                    </div>
                  </div>

                  {/* Badges footer */}
                  <div className="mt-4 pt-2.5 border-t border-zinc-950/60 flex items-center justify-between text-[9px] text-zinc-500">
                    <span className="font-mono text-[8px] tracking-tight bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 max-w-[80px] truncate">
                      {ch.m3uSource}
                    </span>
                    {ch.isHd && (
                      <span className="bg-red-600/10 text-red-500 font-bold px-1 rounded">HD</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
