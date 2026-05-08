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
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for strict on-demand loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const el = document.getElementById(`media-card-${item.id}`);
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [item.id]);

  useEffect(() => {
    if (!isInView) return;

    setIsLoaded(false);
    setHasError(false);

    const timer = setTimeout(() => {
      const initialSrc = item.thumbnail || (item.type === "image" ? item.src : "");
      console.log(`[MediaCard ${item.id}] Starting load:`, initialSrc);
      setImgSrc(initialSrc);
    }, 50);

    return () => clearTimeout(timer);
  }, [item.thumbnail, item.src, item.type, item.id, isInView]);

  const handleImageError = () => {
    console.warn(`[MediaCard ${item.id}] Failed at:`, imgSrc);

    if (item.fileId) {
      // Stage 1: Try High-Res View
      if (imgSrc.includes("thumbnail?id=")) {
        const nextSrc = `https://drive.google.com/uc?export=view&id=${item.fileId}`;
        console.log(`[MediaCard ${item.id}] Falling back to High-Res View:`, nextSrc);
        setImgSrc(nextSrc);
        return;
      }
      // Stage 2: Try Direct CDN (lh3)
      if (imgSrc.includes("uc?export=view")) {
        const nextSrc = `https://lh3.googleusercontent.com/d/${item.fileId}=s800`;
        console.log(`[MediaCard ${item.id}] Falling back to Direct CDN (lh3):`, nextSrc);
        setImgSrc(nextSrc);
        return;
      }
    }

    console.error(`[MediaCard ${item.id}] All loading stages failed.`);
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      id={`media-card-${item.id}`}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-[#0a0908] transition-all duration-700 shadow-2xl aspect-video ${isLoaded ? 'hover:border-amber-500/30' : ''}`}
      onClick={onClick}
    >
      {/* Image / Video Container */}
      <div className="relative z-0 h-full w-full overflow-hidden bg-[#0a0908]">
        {imgSrc && !hasError ? (
          <img
            src={imgSrc}
            alt="Archive Entry"
            className={`h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0 scale-105'}`}
            loading="lazy"
            onLoad={() => {
              console.log(`[MediaCard ${item.id}] Successfully loaded:`, imgSrc);
              setIsLoaded(true);
              setHasError(false);
            }}
            onError={handleImageError}
          />
        ) : null}

        {/* Unified minimalist placeholder - No lines or labels */}
        {(!isLoaded || hasError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0b0a]">
            <div className="loading-pulse absolute inset-0 opacity-10" />
          </div>
        )}
      </div>

      {/* Warm Ambient Overlay - Only on loaded items */}
      {isLoaded && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-amber-950/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}

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
