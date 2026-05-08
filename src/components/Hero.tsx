import { Camera, Film, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-[10%] h-2 w-2 rounded-full bg-yellow-300/40 animate-float" />
        <div className="absolute top-40 left-[20%] h-1.5 w-1.5 rounded-full bg-pink-300/40 animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-32 right-[15%] h-2 w-2 rounded-full bg-blue-300/40 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-[30%] h-1 w-1 rounded-full bg-purple-300/50 animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-16 right-[30%] h-1.5 w-1.5 rounded-full bg-indigo-300/40 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-[25%] h-2 w-2 rounded-full bg-amber-300/30 animate-float" style={{ animationDelay: "0.8s" }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm">
          <Sparkles size={14} className="text-yellow-400" />
          <span>A collection of unforgettable moments</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
          <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            High School
          </span>
          <br />
          <span className="bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-400 bg-clip-text text-transparent">
            Memories
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">
          Every photo tells a story, every video captures a feeling. 
          Scroll through the moments that made these years truly special. ✨
        </p>

        {/* Stats */}
        <div className="mt-10 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-white/50">
            <Camera size={18} className="text-purple-400" />
            <span className="text-sm font-medium">Photos</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2 text-white/50">
            <Film size={18} className="text-pink-400" />
            <span className="text-sm font-medium">Videos</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2 text-white/50">
            <Sparkles size={18} className="text-yellow-400" />
            <span className="text-sm font-medium">Memories</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1">
            <div className="h-2 w-1 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
