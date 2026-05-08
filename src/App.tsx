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
  const [visibleCount, setVisibleCount] = useState(24);


  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      return activeFilter === "all" || item.type === activeFilter;
    });
  }, [activeFilter]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);


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

        {/* Masonry Archive Grid */}
        {visibleItems.length > 0 ? (
          <>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {visibleItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="mb-4 break-inside-avoid animate-fade-in"
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

            {visibleCount < filteredItems.length && (
              <div className="mt-32 text-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="group relative inline-flex cursor-pointer items-center gap-4 overflow-hidden rounded-none border border-white/5 bg-white/5 px-16 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-accent hover:border-accent active:scale-95 shadow-2xl"
                >
                  <span className="relative z-10">Expand Archive</span>
                </button>
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
