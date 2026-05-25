import { useState, useEffect } from "react";
import { Users, Tv, Download, Heart, Flame, Shield, Monitor, LifeBuoy } from "lucide-react";
import { VisitorStats } from "../types";

export function BottomNavbar() {
  const [activeTab, setActiveTab] = useState("home");

  const handleScrollToSegment = (id: string, tab: string) => {
    setActiveTab(tab);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-black/80 border-t border-white/5 md:hidden flex justify-around items-center h-16 px-4 backdrop-blur-md">
      {/* 1. Home */}
      <button
        onClick={() => handleScrollToSegment("root", "home")}
        className={`flex flex-col items-center justify-center w-12 h-12 transition ${
          activeTab === "home" ? "text-red-500" : "text-zinc-500 hover:text-white"
        }`}
      >
        <Monitor className="w-5 h-5" />
        <span className="text-[9px] font-mono uppercase tracking-wider mt-1">Home</span>
      </button>

      {/* 2. TV Player */}
      <button
        onClick={() => handleScrollToSegment("atv-player-container", "player")}
        className={`flex flex-col items-center justify-center w-12 h-12 transition ${
          activeTab === "player" ? "text-red-500" : "text-zinc-500 hover:text-white"
        }`}
      >
        <Tv className="w-5 h-5" />
        <span className="text-[9px] font-mono uppercase tracking-wider mt-1">Player</span>
      </button>

      {/* 3. Support section */}
      <button
        onClick={() => {
          setActiveTab("support");
          const elem = document.getElementById("support-section");
          if (elem) elem.scrollIntoView({ behavior: "smooth" });
        }}
        className={`flex flex-col items-center justify-center w-12 h-12 transition ${
          activeTab === "support" ? "text-red-500" : "text-zinc-500 hover:text-white"
        }`}
      >
        <LifeBuoy className="w-5 h-5" />
        <span className="text-[9px] font-mono uppercase tracking-wider mt-1">Support</span>
      </button>

      {/* 4. Download Trigger */}
      <button
        onClick={() => handleScrollToSegment("app-download-section", "download")}
        className={`flex flex-col items-center justify-center w-12 h-12 transition ${
          activeTab === "download" ? "text-red-500" : "text-zinc-500 hover:text-white"
        }`}
      >
        <Download className="w-5 h-5 animate-bounce text-red-500" />
        <span className="text-[9px] font-mono uppercase tracking-wider mt-1">Download</span>
      </button>
    </div>
  );
}

export default function FooterNavbar() {
  const [visitorCount, setVisitorCount] = useState<number>(12845);

  useEffect(() => {
    // Fire real visitor stat register on render
    fetch("/api/visitor/hit", { method: "POST" })
      .then((res) => res.json())
      .then((data: { status: string; count: number }) => {
        if (data && data.count) {
          setVisitorCount(data.count);
        }
      })
      .catch((err) => {
        console.warn("Unable to hit visitor API stats endpoint, using in-memory:", err);
      });
  }, []);

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-12 px-6 space-y-8 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
        
        {/* Brand identity */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-black/40 border border-white/10 hover:rotate-6 transition duration-200 shadow-lg p-0.5">
              <img 
                src="https://www.atvsports.live/icon.png" 
                alt="ATV Sports" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-display font-extrabold text-lg text-white tracking-widest uppercase">
              ATV <span className="text-red-500 text-neon-glow">SPORTS</span>
            </span>
          </div>
          <p className="text-zinc-500 text-xs max-w-sm">
            Watch live sports streams, tournaments, TV channels, and cricket match leagues with low buffering delays.
          </p>
        </div>

        {/* Dynamic Visitor stats widget */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-md">
          <div className="p-2 bg-red-950 border border-red-900/60 rounded-xl text-red-500">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Total Site Engagements</p>
            <p className="text-lg font-mono font-bold text-white mt-1">
              {visitorCount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-zinc-500">
        <p>© 2026 ATV Sports IPTV. All Streaming networks respect fair usage.</p>
        <div className="flex items-center gap-4 uppercase select-none">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> PWA Certified
          </span>
          <span className="text-zinc-700">|</span>
          <span>100% SMART TV Browser Optimized</span>
        </div>
      </div>

      <div className="h-12 md:hidden" /> {/* Height buffer for mobile bottom navbar overlapping prevention */}
    </footer>
  );
}
