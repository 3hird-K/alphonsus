import { useEffect, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, Calendar, Tag, ExternalLink } from "lucide-react";
import type { MediaItem } from "../data/types";

interface LightboxProps {
  item: MediaItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ item, onClose, onPrev, onNext }: LightboxProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 animate-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-10 flex h-14 w-14 items-center justify-center border border-white/10 bg-black/50 text-white transition-all hover:bg-accent hover:border-accent hover:scale-110 cursor-pointer"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-8 z-10 flex h-24 w-12 items-center justify-center border border-white/5 bg-black/20 text-white/40 transition-all hover:bg-accent/20 hover:text-white cursor-pointer"
        aria-label="Previous item"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-8 z-10 flex h-24 w-12 items-center justify-center border border-white/5 bg-black/20 text-white/40 transition-all hover:bg-accent/20 hover:text-white cursor-pointer"
        aria-label="Next item"
      >
        <ChevronRight size={32} />
      </button>

      {/* Content */}
      <div
        className="flex max-h-[95vh] max-w-[95vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "video" ? (
          <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl bg-black">
            <iframe
              src={item.src}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen"
              onLoad={() => setIsLoading(false)}
            ></iframe>
          </div>
        ) : (
          <div className="relative">
            {isLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="h-1 w-24 bg-white/10 overflow-hidden">
                  <div className="h-full bg-white animate-shimmer" style={{ width: '50%' }} />
                </div>
              </div>
            )}
            {!imageError ? (
              <img
                src={item.src}
                className="max-h-[85vh] rounded-3xl object-contain shadow-2xl transition-opacity duration-300"
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.warn(`[Lightbox ${item.id}] Failed to load:`, target.src);
                  if (item.fileId) {
                    if (!target.src.includes("sz=w1600") && !target.src.includes("uc?id=")) {
                      const nextSrc = `https://drive.google.com/thumbnail?id=${item.fileId}&sz=w1600`;
                      console.log(`[Lightbox ${item.id}] Falling back to high-res thumbnail:`, nextSrc);
                      target.src = nextSrc;
                      return;
                    } else if (!target.src.includes("uc?id=")) {
                      const nextSrc = `https://drive.google.com/uc?id=${item.fileId}`;
                      console.log(`[Lightbox ${item.id}] Falling back to direct uc:`, nextSrc);
                      target.src = nextSrc;
                      return;
                    }
                  }
                  console.error(`[Lightbox ${item.id}] All attempts failed.`);
                  setImageError(true);
                  setIsLoading(false);
                }}
              />
            ) : (
              <div className="flex min-h-80 min-w-[320px] items-center justify-center rounded-none border border-white/10 bg-white/2 text-center text-white/20 shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Format Error</p>
              </div>
            )}
          </div>
        )}

        {/* Minimal Label - Removed as requested */}
      </div>
    </div>
  );
}
