"use client";

import { ArrowLeft, Zap } from "lucide-react";
import type { GameMode } from "@/lib/types";
import type { GameMeta } from "@/lib/games";

interface Props {
  game: GameMeta;
  onSelect: (mode: GameMode) => void;
  onBack: () => void;
}

const MODES: { mode: GameMode; label: string; detail: string; count: string }[] = [
  { mode: "rapido", label: "Rápido", detail: "Calentamiento rápido", count: "10 preguntas" },
  { mode: "estandar", label: "Estándar", detail: "Sesión de estudio normal", count: "25 preguntas" },
  { mode: "maraton", label: "Maratón", detail: "Práctica intensiva", count: "50 preguntas" },
  { mode: "survival", label: "Survival", detail: "Hasta el primer error", count: "∞ — récord de racha" },
];

export function ModeSelector({ game, onSelect, onBack }: Props) {
  return (
    <div className="min-h-[100dvh] flex flex-col px-4 pb-8">
      {/* Back + title */}
      <div className="pt-10 pb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors mb-6 -ml-1 touch-target"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Inicio</span>
        </button>

        <h1 className={`text-2xl font-bold tracking-tight ${game.color}`}>
          {game.title}
        </h1>
        <p className="text-[13px] text-slate-500 mt-1">
          {game.description}
        </p>
      </div>

      {/* Mode label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[11px] font-mono text-slate-600 uppercase tracking-widest">
          Modo
        </span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Mode buttons */}
      <div className="flex flex-col gap-3">
        {MODES.map(({ mode, label, detail, count }) => (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className={`
              group flex items-center gap-4 rounded-2xl p-5 w-full text-left
              bg-slate-900/80 border border-slate-800
              hover:border-slate-700 hover:bg-slate-900
              active:scale-[0.98]
              transition-all duration-150 ease-out
              shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
              ${mode === "survival" ? "border-orange-500/20 hover:border-orange-500/40" : ""}
            `}
          >
            {mode === "survival" ? (
              <div className="shrink-0 w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Zap size={20} className="text-orange-400" />
              </div>
            ) : (
              <div className={`shrink-0 w-11 h-11 rounded-xl ${game.bgColor} flex items-center justify-center`}>
                <span className={`text-lg font-bold font-mono ${game.color} leading-none`}>
                  {mode === "rapido" && "10"}
                  {mode === "estandar" && "25"}
                  {mode === "maraton" && "50"}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-semibold text-slate-100">
                  {label}
                </span>
                <span className={`text-[11px] font-mono ${mode === "survival" ? "text-orange-400" : "text-slate-500"}`}>
                  {count}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">{detail}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
