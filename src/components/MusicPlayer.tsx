import { useState, useEffect, useRef, useCallback } from "react";
import { Music, Volume2, VolumeX, SkipForward, Play, Pause } from "lucide-react";

// Import music assets
import music1 from "../assets/music/music1.mp4";
import music2 from "../assets/music/music2.mp4";
import music3 from "../assets/music/music3.mp3";
import music4 from "../assets/music/music4.mp4";

const SHUFFLED_PLAYLIST = [
  { id: 1, title: "Track 01", src: music1 },
  { id: 2, title: "Track 02", src: music2 },
  { id: 3, title: "Track 03", src: music3 },
  { id: 4, title: "Track 04", src: music4 },
].sort(() => Math.random() - 0.5);

interface MusicPlayerProps {
  isDucked: boolean;
}

export default function MusicPlayer({ isDucked }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = SHUFFLED_PLAYLIST[currentTrackIndex];

  useEffect(() => {
    console.log(`[MusicPlayer] Initializing with: ${currentTrack.title}`);
  }, []);

  // Handle Autoplay policy
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isPlaying) {
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        }
      }
      window.removeEventListener("click", handleFirstInteraction);
    };
    window.addEventListener("click", handleFirstInteraction);
    return () => window.removeEventListener("click", handleFirstInteraction);
  }, [isPlaying]);

  // Handle ducking logic
  useEffect(() => {
    if (audioRef.current) {
      const targetVolume = isDucked ? 0.05 : 0.4;
      // Smooth volume transition
      let currentVol = audioRef.current.volume;
      const step = isDucked ? -0.05 : 0.05;
      
      const interval = setInterval(() => {
        if (audioRef.current) {
          currentVol += step;
          if ((step > 0 && currentVol >= targetVolume) || (step < 0 && currentVol <= targetVolume)) {
            audioRef.current.volume = targetVolume;
            clearInterval(interval);
          } else {
            audioRef.current.volume = Math.max(0, Math.min(1, currentVol));
          }
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isDucked]);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % SHUFFLED_PLAYLIST.length);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2">
      <div className="glass flex items-center gap-6 rounded-full px-8 py-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/5 backdrop-blur-3xl">
        {/* Track Info */}
        <div className="flex items-center gap-4 border-r border-white/10 pr-6">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent ${isPlaying ? 'animate-pulse-slow' : ''}`}>
            <Music size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Background Frequency</span>
            <span className="text-[11px] font-bold text-white/90">{currentTrack.title}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5">
          <button 
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white hover:bg-accent hover:text-white transition-all duration-300"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipForward size={18} />
          </button>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/40 hover:text-white transition-colors"
          >
            {isMuted || isDucked ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.src}
          loop={false}
          muted={isMuted}
          onEnded={handleNext}
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Dynamic Visualizer Dots */}
        <div className="flex items-end gap-1 h-3 ml-2">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-[2px] bg-accent/60 transition-all duration-500 rounded-full ${isPlaying ? 'animate-bounce' : 'h-1'}`}
              style={{ 
                height: isPlaying ? `${Math.random() * 100 + 20}%` : '2px',
                animationDelay: `${i * 150}ms`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
