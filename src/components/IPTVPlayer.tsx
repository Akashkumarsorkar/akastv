import { useEffect, useRef, useState, ChangeEvent } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize2, Tv, AlertCircle, RefreshCw, Radio } from "lucide-react";
import { Channel } from "../types";

interface IPTVPlayerProps {
  channel: Channel | null;
  onPrevChannel?: () => void;
  onNextChannel?: () => void;
}

export default function IPTVPlayer({ channel, onPrevChannel, onNextChannel }: IPTVPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default web standard is muted for autoplay compliance
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(1);
  const hlsRef = useRef<Hls | null>(null);
  const [useProxy, setUseProxy] = useState(false);

  // Favor high-performance direct stream playback on new channel selection
  useEffect(() => {
    setUseProxy(false);
  }, [channel]);

  // Construct correct streaming URL depending on proxy fallback state
  const streamUrl = channel
    ? useProxy
      ? `/api/stream-proxy?url=${encodeURIComponent(channel.url)}`
      : channel.url
    : "";

  useEffect(() => {
    if (!channel || !streamUrl) return;

    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setHasError(false);

    // Stop current stream before establishing new streams
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Playback logic
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 30, // Balanced buffer sizes and response lengths
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isPlaying) {
          video.play().catch(() => {
            // Autoplay blocked fallback – typical on browser starts without interactions
            setIsPlaying(false);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn(`HLS stream issue encountered (fatal: ${data.fatal}):`, data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Secure, fail-safe switch to server-side proxy on network failure or CORS preflight blocks
              if (!useProxy) {
                console.info("Direct network/CORS loading failed. Bypassing blocker with CORS-safe stream proxy...");
                setUseProxy(true);
              } else {
                console.info("Network issues on proxy stream. Attempting loader recovery...");
                hls.startLoad();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.info("Media decoding buffer error. Recovering media streams...");
              hls.recoverMediaError();
              break;
            default:
              if (!useProxy) {
                console.info("Fallback to stream-proxy due to fatal error:", data.details);
                setUseProxy(true);
              } else {
                console.error("Fatal playback error persists. Stream might be offline.");
                setHasError(true);
                setIsLoading(false);
              }
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Apple device support (Safari/iOS)
      video.src = streamUrl;

      const handleMetaLoaded = () => {
        setIsLoading(false);
        if (isPlaying) {
          video.play().catch(() => {
            setIsPlaying(false);
          });
        }
      };

      const handleNativeError = () => {
        if (!useProxy) {
          console.info("Native stream error. Activating stream proxy...");
          setUseProxy(true);
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      };

      video.addEventListener("loadedmetadata", handleMetaLoaded);
      video.addEventListener("error", handleNativeError);

      return () => {
        video.removeEventListener("loadedmetadata", handleMetaLoaded);
        video.removeEventListener("error", handleNativeError);
      };
    } else {
      setHasError(true);
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel, streamUrl, useProxy]);

  // Handle updates to user media settings
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.volume = volume;
  }, [isMuted, volume]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handeVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error("Fullscreen initiation failed:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleRetry = () => {
    const video = videoRef.current;
    if (!video || !channel) return;
    setHasError(false);
    setIsLoading(true);

    if (!useProxy) {
      setUseProxy(true);
    } else {
      if (hlsRef.current) {
        hlsRef.current.loadSource(streamUrl);
        hlsRef.current.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }
  };

  if (!channel) {
    return (
      <div className="w-full aspect-video md:h-[480px] bg-[#0c0c0c] border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 neon-border-red">
        <Tv className="w-16 h-16 text-red-600 animate-pulse mb-4" />
        <h3 className="text-2xl font-display font-medium text-neon-glow text-white mb-2">No Channel Selected</h3>
        <p className="text-zinc-400 max-w-sm text-sm">
          Welcome to ATV Sports IPTV. Pick a stream from the categories below to start watching immediate premium sport streams.
        </p>
      </div>
    );
  }

  return (
    <div
      id="atv-player-container"
      ref={containerRef}
      className="group relative w-full aspect-video md:h-[480px] bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
    >
      {/* Dynamic Native Video Tag */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
      />

      {/* Loading Buffering Widget */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
          <RefreshCw className="w-14 h-14 text-red-600 animate-spin mb-3" />
          <span className="text-red-500 font-mono text-xs tracking-wider uppercase animate-pulse">
            Connecting Stream Server...
          </span>
        </div>
      )}

      {/* Stream Malfunction Warning */}
      {hasError && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-10 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mb-4 animate-bounce" />
          <h4 className="text-lg font-display font-semibold text-white mb-2">
            Playback Connection Timeout
          </h4>
          <p className="text-zinc-400 text-xs max-w-md mb-6 leading-relaxed">
            This live stream link is busy or currently offline. Our Android app contains redundant backup paths with 100% stable, faster, ad-free loading speed.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleRetry}
              className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition font-medium text-xs text-white flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <a
              href="#app-download-section"
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition font-medium text-xs text-white neon-glow-red animate-pulse"
            >
              Download App (Ads Free)
            </a>
          </div>
        </div>
      )}

      {/* Overlay controls - Shows on player hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
        
        {/* Top bar */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex items-center justify-center">
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://img.icons8.com/neon/96/football.png";
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="text-white font-display font-medium text-sm leading-tight flex items-center gap-2">
                {channel.name}
                {channel.isHd && (
                  <span className="bg-red-600 text-white font-mono font-bold px-1 rounded text-[9px] uppercase tracking-wide">
                    HD
                  </span>
                )}
              </h4>
              <p className="text-rose-500 font-mono text-[10px] uppercase flex items-center gap-1">
                <Radio className="w-3 h-3 animate-ping text-red-500" /> {channel.category} IPTV
              </p>
            </div>
          </div>

          <div className="bg-black/70 border border-zinc-800 rounded-full px-3 py-1 flex items-center gap-2 text-xs">
            <span className="inline-block w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse-glow" />
            <span className="text-zinc-300 font-mono text-[10px] uppercase tracking-wider">LIVE STREAMING</span>
          </div>
        </div>

        {/* Floating Custom Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-transform transform active:scale-95 duration-100 neon-glow-red"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-red-500 transition-colors">
                {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handeVolumeChange}
                className="w-16 md:w-24 h-1 bg-zinc-800 accent-red-600 rounded-lg cursor-pointer appearance-none"
              />
            </div>
          </div>

          {/* Right side options */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors"
              title="Fullscreen Mode"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
