import { useState, useMemo, useCallback } from "react";
import { Camera, Film, LayoutGrid, Heart, ExternalLink } from "lucide-react";
import { mediaItems } from "./data/media";
import type { MediaItem, MediaType } from "./data/types";
import MediaCard from "./components/MediaCard";
import Lightbox from "./components/Lightbox";

type FilterType = "all" | MediaType;

export default function App() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);


  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      return activeFilter === "all" || item.type === activeFilter;
    });
  }, [activeFilter]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);


  // Infinite scroll observer - Facebook style batching
  const observerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || isLoadingBatch) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < filteredItems.length) {
        setIsLoadingBatch(true);
        // Simulated "Fetch" delay to prevent request bursts
        setTimeout(() => {
          setVisibleCount(prev => prev + 20);
          setIsLoadingBatch(false);
        }, 800);
      }
    }, { threshold: 0.1, rootMargin: "100px" });
    
    observer.observe(node);
  }, [filteredItems.length, visibleCount, isLoadingBatch]);

  const imageCount = mediaItems.filter((i) => i.type === "image").length;
  const videoCount = mediaItems.filter((i) => i.type === "video").length;

  const handleLightboxOpen = useCallback((item: MediaItem) => {
    setLightboxItem(item);
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxItem(null);
  }, []);

  const handleLightboxPrev = useCallback(() => {
    setLightboxItem((current: MediaItem | null) => {
      if (!current) return null;
      const idx = filteredItems.findIndex((i) => i.id === current.id);
      return filteredItems[(idx - 1 + filteredItems.length) % filteredItems.length];
    });
  }, [filteredItems]);

  const handleLightboxNext = useCallback(() => {
    setLightboxItem((current: MediaItem | null) => {
      if (!current) return null;
      const idx = filteredItems.findIndex((i) => i.id === current.id);
      return filteredItems[(idx + 1) % filteredItems.length];
    });
  }, [filteredItems]);

  const filterButtons: { key: FilterType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "all", label: "All", icon: <LayoutGrid size={16} />, count: mediaItems.length },
    { key: "image", label: "Photos", icon: <Camera size={16} />, count: imageCount },
    { key: "video", label: "Videos", icon: <Film size={16} />, count: videoCount },
  ];

  return (
    <div className="min-h-screen bg-industrial text-white selection:bg-amber-500/30">
      {/* Industrial Header */}
      {/* <header className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="animate-fade-in font-serif text-7xl sm:text-9xl md:text-[12rem] tracking-tight text-white/90">
            Archive
          </h1>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-in text-xs uppercase tracking-[0.6em] text-accent font-bold" style={{ animationDelay: '150ms' }}>
            {imageCount + videoCount} Captured Fragments
          </p>
        </div>
      </header> */}

      {/* Main Content Section */}
      <main className="relative z-10 mx-auto max-w-[1800px] px-4 pb-32 sm:px-6 lg:px-8">
        {/* Navigation - Minimalist Glass */}
        <div className="sticky top-8 z-50 mb-20 flex justify-center">
          <nav className="glass rounded-full p-1 shadow-2xl backdrop-blur-2xl flex items-center gap-1">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setActiveFilter(btn.key)}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeFilter === btn.key
                  ? "bg-accent text-white shadow-[0_0_20px_rgba(217,119,6,0.4)] scale-105"
                  : "text-white/30 hover:text-white"
                  }`}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sequential Grid Archive */}
        {visibleItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index % 12) * 40}ms` }}
                >
                  <MediaCard
                    item={item}
                    index={index}
                    onClick={() => handleLightboxOpen(item)}
                  />
                </div>
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            {visibleCount < filteredItems.length && (
              <div 
                ref={observerRef} 
                className="h-40 flex items-center justify-center mt-20"
              >
                <div className="flex flex-col items-center gap-4 opacity-20">
                  <div className="h-10 w-[1px] bg-white animate-bounce" />
                  <span className="text-[8px] uppercase tracking-[0.4em]">Decrypting Archive</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-40 text-center glass rounded-none border-dashed border-white/10">
            <h3 className="text-sm font-black text-white/20 uppercase tracking-[0.5em]">No items found</h3>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      {/* <footer className="border-t border-white/5 bg-[#0a0908] py-32 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-2xl font-serif italic text-white/20">ALPHONSUS</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/10">
            Established 2026 &bull; Permanent Collection
          </div>
        </div>
      </footer> */}

      {/* Lightbox */}
      <Lightbox
        item={lightboxItem}
        onClose={handleLightboxClose}
        onPrev={handleLightboxPrev}
        onNext={handleLightboxNext}
      />
    </div>
  );
}
