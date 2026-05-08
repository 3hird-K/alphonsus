import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Music, Volume2, VolumeX, SkipForward, Play, Pause } from "lucide-react";

// Import music assets
import music1 from "../assets/music/music1.mp4";
import music2 from "../assets/music/music2.mp4";
import music3 from "../assets/music/music3.mp3";
import music4 from "../assets/music/music4.mp4";

// The official list of 45 people to celebrate
const NAMES = [
  "Don Jay Borres", "Rolando Tradio", "Neil Dime", "Rommel Villamor", 
  "Janverclyd Dacara", "Vanness Monciller", "John Dave Oyangoren", 
  "Jerwin Ceriola", "Miko Omandam", "Kenneth James Ritos", "Shane Viva", 
  "Kerr Pablo Avenido", "Jerald Sigod", "Ivan Mosquito", "April John Nuñez", 
  "Richard Talipan", "Clark Sasil", "Alvin Edaniol", "James Robles", 
  "Julius Delos Santos", "Angelo Sagliba", "Reynan Aguilario", "Dave Abuyen", 
  "Mark Alwyn Ramirez", "Clark Rey Coscos", "Rhay Justin Alfaro", 
  "Rejie Hyle Mahinay", "Justin Ian Perandos", "Adrian Cacaldo", 
  "Gabriel Tacuyan", "Christian Generale", "Rowel Supida", "Mark Canlom", 
  "John Paul Olarte", "Lucino Alimento", "Cyros Jake Samuray", 
  "Khalid Alindogan", "Jevoy Bagnol", "Eugene Abrigo", "Ace Jastin Calinawan", 
  "Edgar Castillo", "Earl Anthony Daday", "John Bantilan", "Bret Calago", 
  "Gilbert Punay"
];

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
  const [currentName, setCurrentName] = useState(NAMES[Math.floor(Math.random() * NAMES.length)]);
  const [nameFade, setNameFade] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = SHUFFLED_PLAYLIST[currentTrackIndex];

  // Randomize names every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNameFade(false);
      setTimeout(() => {
        const nextName = NAMES[Math.floor(Math.random() * NAMES.length)];
        setCurrentName(nextName);
        setNameFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
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
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 w-[95%] sm:w-auto max-w-lg">
      <div className="glass flex items-center gap-3 sm:gap-6 rounded-full px-4 sm:px-8 py-3 sm:py-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/5 backdrop-blur-3xl">
        {/* Track Info */}
        <div className="flex items-center gap-3 sm:gap-4 border-r border-white/10 pr-4 sm:pr-6 flex-1 min-w-0 overflow-hidden">
          <div className={`flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent ${isPlaying ? 'animate-pulse-slow' : ''}`}>
            <Music size={16} className="sm:w-[18px]" />
          </div>
          <div className="flex flex-col justify-center flex-1 min-w-0 text-center">
            <span 
              className={`text-[14px] sm:text-[17px] font-black text-white tracking-tight transition-all duration-500 truncate
                ${nameFade ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-1"}
              `}
            >
              {currentName}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          <button 
            onClick={togglePlay}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/5 text-white hover:bg-accent hover:text-white transition-all duration-300"
          >
            {isPlaying ? <Pause size={16} className="sm:w-[18px]" fill="currentColor" /> : <Play size={16} className="sm:w-[18px] ml-0.5" fill="currentColor" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipForward size={16} className="sm:w-[18px]" />
          </button>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="hidden sm:block text-white/40 hover:text-white transition-colors"
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
