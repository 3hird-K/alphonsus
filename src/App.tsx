import { useState, useMemo, useCallback } from "react";
import { mediaItems } from "./data/media";
import type { MediaItem } from "./data/types";
import MediaCard from "./components/MediaCard";
import Lightbox from "./components/Lightbox";
import MusicPlayer from "./components/MusicPlayer";

export default function App() {
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [activeVideosCount, setActiveVideosCount] = useState(0);

  const isVideoPlaying = activeVideosCount > 0;

  const handleVideoPlayChange = useCallback((playing: boolean) => {
    setActiveVideosCount(prev => playing ? prev + 1 : Math.max(0, prev - 1));
  }, []);

  // Randomize the archive on each refresh
  const shuffledItems = useMemo(() => {
    return [...mediaItems].sort(() => Math.random() - 0.5);
  }, []);

  // Simplified: No filters as requested
  const visibleItems = useMemo(() => {
    return shuffledItems.slice(0, visibleCount);
  }, [shuffledItems, visibleCount]);


  // Infinite scroll observer
  const observerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || isLoadingBatch) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < shuffledItems.length) {
        setIsLoadingBatch(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + 20);
          setIsLoadingBatch(false);
        }, 800);
      }
    }, { threshold: 0.1, rootMargin: "100px" });
    
    observer.observe(node);
  }, [shuffledItems.length, visibleCount, isLoadingBatch]);

  const handleLightboxOpen = useCallback((item: MediaItem) => {
    setLightboxItem(item);
    if (item.type === 'video') handleVideoPlayChange(true);
  }, [handleVideoPlayChange]);

  const handleLightboxClose = useCallback(() => {
    if (lightboxItem?.type === 'video') handleVideoPlayChange(false);
    setLightboxItem(null);
  }, [lightboxItem, handleVideoPlayChange]);

  const handleLightboxPrev = useCallback(() => {
    setLightboxItem((current: MediaItem | null) => {
      if (!current) return null;
      const idx = shuffledItems.findIndex((i) => i.id === current.id);
      const nextItem = shuffledItems[(idx - 1 + shuffledItems.length) % shuffledItems.length];
      
      // Update video count if switching between media types
      if (current.type === 'video' && nextItem.type !== 'video') handleVideoPlayChange(false);
      if (current.type !== 'video' && nextItem.type === 'video') handleVideoPlayChange(true);
      
      return nextItem;
    });
  }, [shuffledItems, handleVideoPlayChange]);

  const handleLightboxNext = useCallback(() => {
    setLightboxItem((current: MediaItem | null) => {
      if (!current) return null;
      const idx = shuffledItems.findIndex((i) => i.id === current.id);
      const nextItem = shuffledItems[(idx + 1) % shuffledItems.length];
      
      // Update video count if switching between media types
      if (current.type === 'video' && nextItem.type !== 'video') handleVideoPlayChange(false);
      if (current.type !== 'video' && nextItem.type === 'video') handleVideoPlayChange(true);
      
      return nextItem;
    });
  }, [shuffledItems, handleVideoPlayChange]);

  return (
    <div className="min-h-screen bg-industrial text-white selection:bg-amber-500/30">
      {/* Main Content Section */}
      <main className="relative z-10 mx-auto max-w-full p-0 pb-48">
        
        {/* Sequential Grid Archive */}
        {visibleItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visibleItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className={`animate-fade-in ${item.type === 'video' ? 'col-span-2 row-span-2' : ''}`}
                  style={{ animationDelay: `${(index % 12) * 40}ms` }}
                >
                  <MediaCard
                    item={item}
                    index={index}
                    onClick={() => handleLightboxOpen(item)}
                    onVideoPlay={handleVideoPlayChange}
                  />
                </div>
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            {visibleCount < shuffledItems.length && (
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

      {/* Floating Music Player */}
      <MusicPlayer isDucked={isVideoPlaying} />

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
