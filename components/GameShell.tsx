"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap } from "lucide-react";
import type { GameMode, GameSlug, QuizQuestion } from "@/lib/types";
import type { GameMeta } from "@/lib/games";
import { ModeSelector } from "./ModeSelector";
import { QuizQuestion as QuizQuestionComponent } from "./QuizQuestion";
import { fetchGameData, buildQuestions, pickItems, getQuestionCount } from "@/lib/quiz-engine";
import { getSeenIds, markSeen, saveScore, saveSurvivalRecord, getGameStats } from "@/lib/storage";
import { GAME_MODE_LENGTHS } from "@/lib/types";

type Phase = "selecting_mode" | "loading" | "playing" | "finished";

interface Props {
  game: GameMeta;
}

export function GameShell({ game }: Props) {
  const router = useRouter();
  const slug = game.slug as GameSlug;

  const [phase, setPhase] = useState<Phase>("selecting_mode");
  const [mode, setMode] = useState<GameMode>("estandar");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [survivalRecord, setSurvivalRecord] = useState(0);

  useEffect(() => {
    const stats = getGameStats(slug);
    setSurvivalRecord(stats.survivalRecord);
  }, [slug]);

  const startGame = useCallback(async (selectedMode: GameMode) => {
    setMode(selectedMode);
    setPhase("loading");

    const data = await fetchGameData(slug);
    const all = buildQuestions(slug, data);
    const seenIds = getSeenIds(slug);
    const n = selectedMode === "survival" ? Math.min(200, all.length) : (getQuestionCount(selectedMode) ?? 25);
    const picked = pickItems(all, n, seenIds);

    setQuestions(picked);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setPhase("playing");
  }, [slug]);

  const handleSelect = useCallback((value: string) => {
    if (selected !== null) return;
    setSelected(value);

    const q = questions[currentIdx];
    const correct = q.opciones.find((o) => o.value === value)?.isCorrect ?? false;

    if (correct) {
      setScore((s) => s + 1);
      if (mode === "survival") setStreak((s) => s + 1);
    } else if (mode === "survival") {
      // Game over
      const finalStreak = streak;
      saveSurvivalRecord(slug, finalStreak);
      setSurvivalRecord((prev) => Math.max(prev, finalStreak));
    }
  }, [selected, questions, currentIdx, mode, streak, slug]);

  const handleNext = useCallback(() => {
    const q = questions[currentIdx];
    const correct = q.opciones.find((o) => o.value === selected)?.isCorrect ?? false;

    if (mode === "survival" && !correct) {
      // End survival
      markSeen(slug, questions.slice(0, currentIdx + 1).map((q) => q.id));
      setPhase("finished");
      return;
    }

    if (currentIdx + 1 >= questions.length) {
      markSeen(slug, questions.map((q) => q.id));
      if (mode !== "survival") {
        // score already updated by handleSelect — no double-count
        saveScore(slug, mode as Exclude<GameMode, "survival">, score, questions.length);
      }
      setPhase("finished");
      return;
    }

    setCurrentIdx((i) => i + 1);
    setSelected(null);
  }, [currentIdx, questions, selected, mode, slug, score]);

  // ── Selecting mode ────────────────────────────────────────────────────────

  if (phase === "selecting_mode") {
    return (
      <ModeSelector
        game={game}
        onSelect={startGame}
        onBack={() => router.push("/")}
      />
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
          <span className="text-sm text-slate-500 font-mono">Cargando ejercicios...</span>
        </div>
      </div>
    );
  }

  // ── Finished ──────────────────────────────────────────────────────────────

  if (phase === "finished") {
    const isSurvival = mode === "survival";
    const total = questions.length;
    const pct = isSurvival ? null : Math.round((score / total) * 100);
    const currentSurvivalRecord = Math.max(survivalRecord, streak);

    return (
      <div className="min-h-[100dvh] flex flex-col px-4 pb-8">
        <div className="pt-12 pb-8">
          <span className="text-[11px] font-mono text-slate-600 uppercase tracking-widest">
            {game.title}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 mt-2">
            {isSurvival ? "Game Over" : pct! >= 80 ? "Muy bien" : pct! >= 60 ? "Bien" : "Seguí practicando"}
          </h1>
        </div>

        {/* Result card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {isSurvival ? (
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">Racha alcanzada</span>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-5xl font-bold font-mono text-orange-400">{streak}</span>
                  <span className="text-slate-500 mb-2 text-sm">seguidas</span>
                </div>
              </div>
              <div className="h-px bg-slate-800" />
              <div>
                <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">Récord</span>
                <div className="flex items-center gap-2 mt-1">
                  <Zap size={16} className="text-orange-400" />
                  <span className="text-xl font-bold font-mono text-slate-200">{currentSurvivalRecord}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">Puntaje</span>
                <div className="flex items-end gap-2 mt-1">
                  <span className={`text-5xl font-bold font-mono ${pct! >= 80 ? "text-emerald-400" : pct! >= 60 ? "text-amber-400" : "text-rose-400"}`}>
                    {score}
                  </span>
                  <span className="text-slate-500 mb-2 text-sm">/ {total}</span>
                  <span className={`text-xl font-bold font-mono mb-1 ${pct! >= 80 ? "text-emerald-500" : pct! >= 60 ? "text-amber-500" : "text-rose-500"}`}>
                    ({pct}%)
                  </span>
                </div>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Modo</span>
                <span className="font-mono text-slate-300 capitalize">{mode}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-5">
          <button
            onClick={() => startGame(mode)}
            className="w-full min-h-[56px] rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all text-white font-semibold text-[15px] flex items-center justify-center gap-2"
          >
            Jugar de nuevo
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setPhase("selecting_mode")}
            className="w-full min-h-[56px] rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 active:scale-[0.98] transition-all text-slate-300 font-medium text-[15px]"
          >
            Cambiar modo
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full min-h-[56px] rounded-2xl text-slate-500 hover:text-slate-400 transition-colors font-medium text-[14px]"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ── Playing ───────────────────────────────────────────────────────────────

  const q = questions[currentIdx];
  const total = mode === "survival" ? null : questions.length;
  const answered = selected !== null;
  const correct = answered ? (q.opciones.find((o) => o.value === selected)?.isCorrect ?? false) : null;
  const isSurvivalDead = mode === "survival" && answered && !correct;

  return (
    <div className="min-h-[100dvh] flex flex-col px-4 pb-8">
      {/* Top bar */}
      <div className="pt-8 pb-5 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono text-slate-600 uppercase tracking-widest">
            {game.title}
          </span>
          {mode === "survival" ? (
            <div className="flex items-center gap-2 mt-0.5">
              <Zap size={12} className="text-orange-400" />
              <span className="text-sm font-mono text-orange-400 font-bold">{streak}</span>
              {survivalRecord > 0 && (
                <span className="text-[11px] font-mono text-slate-600">/ {survivalRecord} récord</span>
              )}
            </div>
          ) : (
            <span className="text-sm font-mono text-slate-400 mt-0.5">
              {currentIdx + 1} / {total}
            </span>
          )}
        </div>
        {mode !== "survival" && (
          <div className="flex-1 max-w-[160px]">
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / (total ?? 1)) * 100}%` }}
              />
            </div>
          </div>
        )}
        <span className="text-sm font-mono text-slate-400 tabular-nums">
          {score} ok
        </span>
      </div>

      {/* Question */}
      <div className="flex-1">
        <QuizQuestionComponent
          question={q}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>

      {/* Next button */}
      {answered && (
        <div className="pt-5">
          {isSurvivalDead ? (
            <button
              onClick={() => {
                markSeen(slug, questions.slice(0, currentIdx + 1).map((q) => q.id));
                setPhase("finished");
              }}
              className="w-full min-h-[56px] rounded-2xl bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 active:scale-[0.98] transition-all text-rose-300 font-semibold text-[15px]"
            >
              Ver resultado
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full min-h-[56px] rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all text-white font-semibold text-[15px] flex items-center justify-center gap-2"
            >
              {currentIdx + 1 >= (total ?? Infinity) ? "Ver resultado" : "Siguiente"}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
