import Link from "next/link";
import { ChevronRight, Trophy, Zap } from "lucide-react";
import type { GameMeta } from "@/lib/games";
import type { GameStats } from "@/lib/types";

interface Props {
  game: GameMeta;
  stats?: GameStats;
}

export function GameCard({ game, stats }: Props) {
  const bestOverall = stats
    ? Math.max(
        stats.byMode.rapido.best,
        stats.byMode.estandar.best,
        stats.byMode.maraton.best
      )
    : 0;
  const bestTotal = stats
    ? [stats.byMode.rapido, stats.byMode.estandar, stats.byMode.maraton].find(
        (m) => m.best === bestOverall
      )?.total ?? 0
    : 0;
  const survivalRecord = stats?.survivalRecord ?? 0;
  const hasPlayed = bestOverall > 0 || survivalRecord > 0;

  return (
    <Link
      href={`/game/${game.slug}`}
      className={`
        group relative flex items-center gap-4 rounded-2xl p-5
        bg-slate-900/80 border ${game.borderColor}
        hover:bg-slate-900 hover:border-opacity-60
        active:scale-[0.98]
        transition-all duration-200 ease-out
        shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
        w-full text-left
      `}
    >
      {/* Icon */}
      <div className={`shrink-0 w-14 h-14 rounded-xl ${game.bgColor} flex items-center justify-center`}>
        <span className={`text-2xl font-bold ${game.color} font-mono leading-none`}>
          {game.slug === "naturaleza" && "N"}
          {game.slug === "permutativo" && "P"}
          {game.slug === "estado" && "E"}
          {game.slug === "asientos" && "A"}
          {game.slug === "mayor" && "M"}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-100 leading-snug">
              {game.title}
            </h2>
            <p className={`text-xs font-mono ${game.color} mt-0.5 opacity-80`}>
              {game.tagline}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors mt-0.5"
          />
        </div>

        <p className="text-[13px] text-slate-500 mt-1.5 leading-snug line-clamp-1">
          {game.description}
        </p>

        {/* Stats */}
        {hasPlayed && (
          <div className="flex items-center gap-3 mt-2">
            {bestOverall > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Trophy size={10} className="text-amber-400" />
                {bestOverall}/{bestTotal}
              </span>
            )}
            {survivalRecord > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Zap size={10} className="text-orange-400" />
                racha {survivalRecord}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
