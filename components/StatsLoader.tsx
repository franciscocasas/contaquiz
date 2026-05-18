"use client";

import { useEffect, useState } from "react";
import { GameCard } from "./GameCard";
import { GAMES } from "@/lib/games";
import { getAllStats } from "@/lib/storage";
import type { AllStats } from "@/lib/types";

export function StatsLoader() {
  const [stats, setStats] = useState<AllStats>({});

  useEffect(() => {
    setStats(getAllStats());
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {GAMES.map((game) => (
        <GameCard key={game.slug} game={game} stats={stats[game.slug]} />
      ))}
    </div>
  );
}
