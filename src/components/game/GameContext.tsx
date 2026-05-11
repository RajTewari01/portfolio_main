"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface GameState {
  isGameMode: boolean;
  gameLoaded: boolean;
  discoveredItems: Set<string>;
  totalItems: number;
}

interface GameContextType extends GameState {
  enterGameMode: () => void;
  exitGameMode: () => void;
  setGameLoaded: (loaded: boolean) => void;
  discoverItem: (id: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [isGameMode, setIsGameMode] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [discoveredItems, setDiscoveredItems] = useState<Set<string>>(new Set());
  const totalItems = 8; // projects + skills + easter eggs

  const enterGameMode = useCallback(() => {
    setIsGameMode(true);
    document.body.style.overflow = "hidden";
  }, []);

  const exitGameMode = useCallback(() => {
    setIsGameMode(false);
    setGameLoaded(false);
    document.body.style.overflow = "";
  }, []);

  const discoverItem = useCallback((id: string) => {
    setDiscoveredItems((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        isGameMode,
        gameLoaded,
        discoveredItems,
        totalItems,
        enterGameMode,
        exitGameMode,
        setGameLoaded,
        discoverItem,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
