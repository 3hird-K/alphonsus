import { useState, useEffect } from "react";
import { Play, ImageIcon, AlertCircle, Camera } from "lucide-react";
import type { MediaItem } from "../data/types";

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onClick: () => void;
}

export default function MediaCard({ item, index, onClick }: MediaCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    // Increased stagger to avoid Google Drive 429 rate limits
    const delay = (index % 24) * 200;
    const timer = setTimeout(() => {
      const initialSrc = item.thumbnail || (item.type === "image" ? item.src : "");
      console.log(`[MediaCard ${item.id}] Attempting initial load:`, initialSrc);
      setImgSrc(initialSrc);
    }, delay);

    return () => clearTimeout(timer);
  }, [item.thumbnail, item.src, item.type, index, item.id]);

  const handleImageError = () => {
    console.warn(`[MediaCard ${item.id}] Failed to load:`, imgSrc);

    // Progressive fallback strategy
    if (item.fileId) {
      // If thumbnail fails, try high-res view
      if (imgSrc.includes("thumbnail?id=")) {
        const nextSrc = `https://drive.google.com/uc?export=view&id=${item.fileId}`;
        console.log(`[MediaCard ${item.id}] Falling back to high-res view:`, nextSrc);
        setImgSrc(nextSrc);
        return;
      }
      // If high-res view fails, try direct lh3 CDN as last resort
      if (imgSrc.includes("uc?export=view")) {
        const nextSrc = `https://lh3.googleusercontent.com/d/${item.fileId}=s800`;
        console.log(`[MediaCard ${item.id}] Falling back to lh3 CDN:`, nextSrc);
        setImgSrc(nextSrc);
        return;
      }
    }

    console.error(`[MediaCard ${item.id}] All loading attempts failed.`);
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-[#0a0908] transition-all duration-700 hover:border-amber-500/30 shadow-2xl"
      onClick={onClick}
    >
      {/* Image / Video Container */}
      <div className="relative z-0 w-full overflow-hidden bg-[#0a0908]">
        {imgSrc && !hasError ? (
          <img
            src={imgSrc}
            alt="Archive Entry"
            className={`w-full transition-all duration-1000 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0 scale-105'}`}
            loading="lazy"
            onLoad={() => {
              console.log(`[MediaCard ${item.id}] Successfully loaded:`, imgSrc);
              setIsLoaded(true);
              setHasError(false);
            }}
            onError={handleImageError}
          />
        ) : null}

        {/* Skeleton State - Industrial Glass */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0b0a]">
            <div className="loading-pulse absolute inset-0 opacity-10" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="h-px w-8 bg-amber-500/20 animate-pulse" />
              <Camera size={14} className="text-white/10" />
              <div className="h-px w-8 bg-amber-500/20 animate-pulse" />
            </div>
          </div>
        )}

        {/* Entry Offline State - Archival Look */}
        {hasError && (
          <div className="flex aspect-video w-full flex-col items-center justify-center bg-[#0c0b0a] border-y border-white/5">
            <div className="mb-4 h-12 w-[1px] bg-amber-500/10" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Archived Fragment</span>
            <span className="mt-2 text-[7px] uppercase tracking-[0.1em] text-white/5 italic">Connectivity Required</span>
            <div className="mt-4 h-12 w-[1px] bg-amber-500/10" />
          </div>
        )}
      </div>

      {/* Warm Ambient Overlay on Hover */}
      <div className="absolute inset-0 z-10 bg-amber-950/0 transition-colors duration-700 group-hover:bg-amber-950/10 pointer-events-none" />

      {/* Dynamic Border Glow */}
      <div className="absolute inset-0 z-20 border border-white/0 transition-all duration-700 group-hover:border-amber-500/20 shadow-[inset_0_0_60px_rgba(217,119,6,0)] group-hover:shadow-[inset_0_0_60px_rgba(217,119,6,0.05)] pointer-events-none" />

      {/* Subtle Icon Overlay */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-black/60 backdrop-blur-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          {item.type === "video" ? (
            <Play size={14} fill="currentColor" className="text-accent" />
          ) : (
            <ImageIcon size={14} className="text-white/40" />
          )}
        </div>
      </div>
    </div>
  );
}
