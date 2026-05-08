import { useEffect, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, Calendar, Tag, ExternalLink } from "lucide-react";
import type { MediaItem } from "../data/types";

interface LightboxProps {
  item: MediaItem | null;
  isSlideshow: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleSlideshow: () => void;
}

export default function Lightbox({ 
  item, 
  isSlideshow, 
  onClose, 
  onPrev, 
  onNext, 
  onToggleSlideshow 
}: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (item) {
      setIsLoading(true);
      setImageError(false);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, handleKeyDown]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Slideshow Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSlideshow();
        }}
        className={`absolute top-6 right-20 z-50 flex h-12 px-6 items-center justify-center rounded-full transition-all hover:scale-105 cursor-pointer border font-black text-[9px] uppercase tracking-widest gap-2
          ${isSlideshow 
            ? "bg-accent text-white border-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]" 
            : "bg-white/10 text-white/70 border-white/10 hover:bg-white/20"
          }
        `}
        aria-label="Toggle Slideshow"
      >
        <div className={`h-1.5 w-1.5 rounded-full ${isSlideshow ? "bg-white animate-pulse" : "bg-white/30"}`} />
        {isSlideshow ? "Slideshow On" : "Slideshow Off"}
      </button>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 cursor-pointer"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 cursor-pointer"
        aria-label="Previous"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 cursor-pointer"
        aria-label="Next"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Content Area */}
      <div
        className="relative flex h-full w-full items-center justify-center p-4 sm:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "video" ? (
          <div className="aspect-video w-full max-w-6xl overflow-hidden rounded-lg shadow-2xl bg-black">
            <iframe
              key={item.id}
              src={`${item.src}${item.src.includes('?') ? '&' : '?'}autoplay=1`}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen"
              onLoad={() => setIsLoading(false)}
              title={`Video ${item.id}`}
            ></iframe>
          </div>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            {isLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-1 w-32 bg-white/10 overflow-hidden rounded-full">
                  <div className="h-full bg-accent animate-shimmer" style={{ width: '40%' }} />
                </div>
              </div>
            )}
            {!imageError ? (
              <img
                key={item.id}
                src={item.src}
                alt={`Archive ${item.id}`}
                className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl transition-all duration-500"
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (item.fileId) {
                    if (target.src.includes("uc?id=") || target.src.includes("uc?export=view")) {
                      const nextSrc = `https://lh3.googleusercontent.com/d/${item.fileId}=s2048`;
                      target.src = nextSrc;
                      return;
                    }
                    if (target.src.includes("lh3.googleusercontent.com")) {
                      const nextSrc = `https://drive.google.com/thumbnail?id=${item.fileId}&sz=w1600`;
                      target.src = nextSrc;
                      return;
                    }
                  }
                  setImageError(true);
                  setIsLoading(false);
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-xl bg-white/5 p-12 backdrop-blur-md">
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Signal Lost</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-6 py-2 text-xs font-bold tracking-widest text-white/70 backdrop-blur-md border border-white/5">
        {item.id} / 389
      </div>
    </div>
  );
}
