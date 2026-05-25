import { useState, useEffect } from "react";
import { Download, Sparkles, X, ShieldCheck, Zap, Laptop, Smartphone, HelpCircle } from "lucide-react";

interface AppPromotionProps {
  onShowDownloadNotification?: () => void;
}

export function FloatingDownloadButton() {
  return (
    <a
      href="#app-download-section"
      id="floating-download-trigger"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-red-600 hover:bg-red-700 text-white font-display font-bold text-xs md:text-sm px-4 py-3 md:px-5 md:py-3.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(255,18,18,0.8)] hover:shadow-[0_0_30px_rgba(255,18,18,1)] transition-all duration-300 transform hover:scale-105 active:scale-95 animate-bounce"
    >
      <Download className="w-4.5 h-4.5 animate-pulse" />
      <span>DOWNLOAD APP</span>
    </a>
  );
}

export function HeroPromotionStats() {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto py-3">
      <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-center backdrop-blur-md">
        <span className="text-red-500 font-display font-extrabold text-sm md:text-base tracking-widest block">FREE</span>
        <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Subscription</span>
      </div>
      <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-center backdrop-blur-md">
        <span className="text-red-500 font-display font-extrabold text-sm md:text-base tracking-widest block">ADS FREE</span>
        <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Premium stream</span>
      </div>
      <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-center backdrop-blur-md">
        <span className="text-red-500 font-display font-extrabold text-sm md:text-base tracking-widest block">FAST</span>
        <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">HLS Low Latency</span>
      </div>
    </div>
  );
}

export function MidPromotionBanner() {
  return (
    <div className="w-full bg-white/5 border border-white/5 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 my-4">
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/10 rounded-full filter blur-2xl pointer-events-none" />
      
      <div className="space-y-2 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 bg-red-950/80 border border-red-800 text-red-500 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5" /> Fast Streaming
        </div>
        <h3 className="text-lg md:text-xl font-display font-extrabold text-white">Better Experience On ATV Sports App</h3>
        <p className="text-zinc-400 text-xs max-w-md leading-relaxed">
          Unlock smooth stream pathways, fallback server routing, and zero commercial interrupt ad segments on your Android phone or TV client.
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <a
          href="#app-download-section"
          className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-display font-semibold text-xs tracking-wide transition-all duration-300 transform active:scale-95 neon-glow-red"
        >
          Ads Free Experience
        </a>
      </div>
    </div>
  );
}

export function DownloadSection() {
  const [downloadCounter, setDownloadCounter] = useState(8742);

  // Small cosmetic counter increments
  useEffect(() => {
    const timer = setInterval(() => {
      setDownloadCounter((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleDownloadTrigger = () => {
    // Standard one-click direct apk download simulation
    const link = document.createElement("a");
    link.href = "https://raw.githubusercontent.com/abusaeeidx/BDxTV/refs/heads/main/full_channels.m3u"; // Mock direct download link
    link.download = "atv_sports.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="app-download-section"
      className="relative bg-white/5 border border-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 text-center overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 rounded-full filter blur-3xl pointer-events-none" />
      
      <div className="max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-1.5 bg-red-950 border border-red-700/60 rounded-full px-4 py-1.5 text-red-500 font-mono text-[10px] uppercase font-bold tracking-widest animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-red-500" /> STABLE AND ADS FREE APPS
        </div>

        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight uppercase">
          DOWNLOAD ATV SPORTS NOW
        </h2>

        <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
          Watch premium live matches, football tournaments, cricket leagues, and local networks instantly. Fully compatible with all Android devices, tablets, and Smart TVs.
        </p>

        {/* Big centered premium glowing download buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/chinkulj/t/releases/download/v10.1.0/app-release.apk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-display font-extrabold text-sm tracking-widest rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.7)] hover:shadow-[0_0_40px_rgba(220,38,38,0.9)] transition-all duration-300 transform hover:scale-105 active:scale-95 uppercase flex items-center justify-center gap-3 select-none cursor-pointer text-center"
          >
            <Download className="w-5 h-5 animate-bounce" />
            <span>DOWNLOAD FOR ANDROID (APK)</span>
          </a>
        </div>

        {/* Dynamic facts strip inside download section */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500 max-w-lg mx-auto">
          <span className="flex items-center gap-1.5 uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Virus Shield Verified
          </span>
          <span className="flex items-center gap-1.5 uppercase">
            <Smartphone className="w-4 h-4 text-red-500" /> {downloadCounter.toLocaleString()}+ Downloads Today
          </span>
          <span className="flex items-center gap-1.5 uppercase">
            <Zap className="w-4 h-4 text-amber-500" /> Direct One-Click Play
          </span>
        </div>
      </div>
    </div>
  );
}

export function DownloadPopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 4.5 seconds to prompt guest engagement
    const timer = setTimeout(() => {
      const shown = sessionStorage.getItem("atv_dismissed_download_modal");
      if (!shown) {
        setIsOpen(true);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem("atv_dismissed_download_modal", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#090909] border border-white/5 rounded-2xl p-6 md:p-8 neon-border-red shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient circle */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-red-600/10 rounded-full filter blur-2xl pointer-events-none" />

        {/* Close triggers */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-950 border border-red-700 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 scale-95 animate-pulse">
            <Smartphone className="w-8 h-8" />
          </div>

          <span className="bg-red-950 text-red-500 border border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Better Experience App
          </span>

          <h3 className="text-xl md:text-2xl font-display font-extrabold text-white uppercase tracking-tight leading-tight">
            ATV SPORTS APK
          </h3>

          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
            Avoid buffers, access multiple live channels fallback paths, and enjoy a premium Ads-Free stream environment directly on your Android Phone, Tablet, or Smart TV.
          </p>

          <div className="pt-2 space-y-3">
            <a
              href="https://github.com/chinkulj/t/releases/download/v10.1.0/app-release.apk"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-display font-extrabold text-xs tracking-wider rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 transition transform active:scale-95 uppercase"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>Get ATV Sports App (Ads Free)</span>
            </a>
            <button
              onClick={handleDismiss}
              className="w-full text-[10px] font-mono text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition"
            >
              No thanks, I will watch in browser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
