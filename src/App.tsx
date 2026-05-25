import { useEffect, useState, useMemo } from "react";
import { Monitor, RefreshCw, Volume2, Shield, Play, HelpCircle, Sparkles, Smartphone, Download, Radio, Info } from "lucide-react";
import { Channel } from "./types";
import IPTVPlayer from "./components/IPTVPlayer";
import ChannelGrid from "./components/ChannelGrid";
import SupportSection from "./components/SupportSection";
import FooterNavbar, { BottomNavbar, BottomNavbar as MobileBottomNav } from "./components/FooterNavbar";
import { DownloadSection, DownloadPopupModal, HeroPromotionStats, MidPromotionBanner, FloatingDownloadButton } from "./components/AppPromotion";

export default function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  
  // States of lists saved inside localstorage for pristine persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("atv_sports_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [recentlyWatched, setRecentlyWatched] = useState<Channel[]>(() => {
    const saved = localStorage.getItem("atv_sports_recents");
    return saved ? JSON.parse(saved) : [];
  });

  const [tvAlertOpen, setTvAlertOpen] = useState(false);

  // Fetch all live channels from backend proxy handler on component mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/channels")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.channels) {
          setChannels(data.channels);
          // Set BTV as default if found, otherwise fall back to first channel
          if (data.channels.length > 0) {
            const btvChannel = data.channels.find((ch: Channel) => {
              const nameLower = ch.name.toLowerCase();
              return nameLower === "btv" || nameLower === "btv live" || nameLower.includes("btv national");
            }) || data.channels.find((ch: Channel) => ch.name.toLowerCase().includes("btv"));
            
            setSelectedChannel(btvChannel || data.channels[0]);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load backend channels:", error);
        setLoading(false);
      });
  }, []);

  // Sync favorites state inside browser localStorage
  useEffect(() => {
    localStorage.setItem("atv_sports_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Sync recently watched streams inside browser localStorage
  useEffect(() => {
    localStorage.setItem("atv_sports_recents", JSON.stringify(recentlyWatched));
  }, [recentlyWatched]);

  // Toggle favorite listings
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Channel selections trigger playbacks and push it to recently watched lists
  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);

    // Save into recents list, deduplicating and limiting items to 6
    setRecentlyWatched((prev) => {
      const filtered = prev.filter((item) => item.id !== channel.id);
      return [channel, ...filtered].slice(0, 6);
    });

    // Smooth scroll upwards to player on responsive screens
    const playerElem = document.getElementById("atv-player-container");
    if (playerElem) {
      playerElem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // TV Remote controls simulation: Listen to arrow keys and enter key global events
  useEffect(() => {
    const handleTVRemoteKeys = (e: KeyboardEvent) => {
      if (channels.length === 0 || !selectedChannel) return;

      const currentIndex = channels.findIndex((ch) => ch.id === selectedChannel.id);
      if (currentIndex === -1) return;

      switch (e.key) {
        case "ArrowRight": {
          // Play next channel in array list
          e.preventDefault();
          const nextIdx = (currentIndex + 1) % channels.length;
          handleSelectChannel(channels[nextIdx]);
          break;
        }
        case "ArrowLeft": {
          // Play previous channel in array list
          e.preventDefault();
          const prevIdx = (currentIndex - 1 + channels.length) % channels.length;
          handleSelectChannel(channels[prevIdx]);
          break;
        }
        case "KeyF":
        case "f": {
          // Toggle full screen or quick fav
          e.preventDefault();
          handleToggleFavorite(selectedChannel.id);
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleTVRemoteKeys);
    return () => window.removeEventListener("keydown", handleTVRemoteKeys);
  }, [channels, selectedChannel]);

  return (
    <div className="min-h-screen animated-bg selection:bg-red-650 selection:text-white">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-black/40 border border-white/10 shadow-[0_0_12px_rgba(220,38,38,0.3)] transform hover:rotate-12 transition p-0.5">
              <img 
                src="https://www.atvsports.live/icon.png" 
                alt="ATV Sports Logo" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base md:text-lg text-white tracking-widest leading-none">
                ATV <span className="text-red-500 text-neon-glow">SPORTS</span>
              </span>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Premium IPTV Hub</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-display font-medium uppercase tracking-wider">
            <a href="#atv-player-container" className="hover:text-red-500 transition-colors">TV Stream</a>
            <a href="#support-section" className="hover:text-red-500 transition-colors">Support</a>
            <a href="#app-download-section" className="hover:text-red-500 transition-colors">Apps</a>
            <button
              onClick={() => setTvAlertOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-red-600 transition flex items-center gap-1.5"
            >
              <Monitor className="w-3.5 h-3.5 text-red-500" />
              <span>Smart TV Guide</span>
            </button>
          </nav>

          {/* Floating Action Header download trigger */}
          <a
            href="#app-download-section"
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-display font-bold text-xs tracking-wide transition transform active:scale-95 duration-100 uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">Get App</span> Play Free
          </a>

        </div>
      </header>

      {/* 2. Main IPTV Player Page layout container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        
        {/* Stream player and Live Channel description board */}
        <section id="atv-player-container" className="space-y-4">
          <IPTVPlayer
            channel={selectedChannel}
            onPrevChannel={() => {}}
            onNextChannel={() => {}} 
          />

          {/* Selected Channel Metadata Info */}
          {selectedChannel && (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black border border-white/5 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                  <img src={selectedChannel.logo} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold text-base flex items-center gap-2">
                    {selectedChannel.name}
                    {selectedChannel.isHd && (
                      <span className="bg-red-650 text-[9px] text-white px-1.5 font-mono font-extrabold rounded">HD</span>
                    )}
                  </h3>
                  <p className="text-zinc-500 text-xs flex items-center gap-1.5 mt-0.5 font-mono">
                    <span>Source: ATV SPORTS</span>
                    <span>•</span>
                    <span className="text-red-500 uppercase">{selectedChannel.category}</span>
                  </p>
                </div>
              </div>

              {/* Micro Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleFavorite(selectedChannel.id)}
                  className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 ${
                    favorites.includes(selectedChannel.id)
                      ? "bg-rose-950/40 border-rose-800 text-rose-500"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>{favorites.includes(selectedChannel.id) ? "❤️ FAVORITED" : "🤍 SAVE PATH"}</span>
                </button>
                <a
                  href="#app-download-section"
                  className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-mono font-bold uppercase transition block"
                >
                  🚀 FAST Stream on App
                </a>
              </div>
            </div>
          )}
        </section>

        {/* Dynamic searchable and filterable channel grid */}
        <section>
          <ChannelGrid
            channels={channels}
            loading={loading}
            selectedChannel={selectedChannel}
            onSelectChannel={handleSelectChannel}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            recentlyWatched={recentlyWatched}
            onRefreshPlayback={() => {}}
          />
        </section>

        {/* Aesthetic promotional banner placed in-between sections */}
        <section>
          <MidPromotionBanner />
        </section>

        {/* Support Section */}
        <section>
          <SupportSection />
        </section>

        {/* Application promotional download area */}
        <section>
          <DownloadSection />
        </section>

      </main>

      {/* Floating features & footer bars */}
      <FloatingDownloadButton />
      <DownloadPopupModal />
      <FooterNavbar />
      
      {/* Mobile-first bottom quick menu actions */}
      <MobileBottomNav />

      {/* TV Guides Informational Prompt Modal */}
      {tvAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#090909] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center select-none relative">
            <button
              onClick={() => setTvAlertOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-red-950 border border-red-800 text-red-500 rounded-xl flex items-center justify-center mx-auto">
              <Monitor className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-display font-extrabold text-white uppercase">Smart TV Navigation</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              If you operate this applet inside a Samsung, LG, Hisense, Sony, Amazon Fire Stick, or Xiaomi Mi Box web browser:
            </p>

            <div className="text-left bg-zinc-950 p-4 rounded-xl space-y-3.5 text-xs text-zinc-350">
              <p>• Use Directional Pad on remote to scroll down into channel grids</p>
              <p>• Use OK/Enter button on remote to play live TV channels</p>
              <p>• Press Right or Left arrow keys to fast navigation</p>
            </div>

            <button
              onClick={() => setTvAlertOpen(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 font-display font-semibold text-xs tracking-wider uppercase rounded-xl text-white transition-all transform active:scale-95 duration-100"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
function X(props: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
