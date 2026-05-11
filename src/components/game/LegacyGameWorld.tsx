"use client";

import { useEffect, useState } from "react";
import { useGame } from "./GameContext";

export default function LegacyGameWorld() {
  const { isGameMode, exitGameMode } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isGameMode || !mounted) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#080808] animate-in fade-in duration-700"
      style={{ isolation: "isolate" }}
    >
      {/* 
        We use an iframe to perfectly sandbox Bruno Simon's Vanilla JS / Vite application.
        This prevents his global CSS, Canvas manipulations, and Cannon.js loops 
        from colliding with Next.js, React Three Fiber, or Framer Motion.
      */}
      <iframe 
        src="/bruno-game/index.html" 
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          background: "#161514", // Matches Bruno's default clear color
        }}
        title="Bruno Simon Game Engine"
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />
      
      {/* Exit Button overlay */}
      <button 
        onClick={exitGameMode}
        className="absolute top-6 right-8 z-[110] px-4 py-2 bg-black/40 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-white/50 hover:text-red-400 font-monospace text-xs tracking-widest uppercase rounded-lg backdrop-blur-md transition-all duration-300"
      >
        ✕ Exit Game
      </button>
    </div>
  );
}
