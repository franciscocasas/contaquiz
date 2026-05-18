import { StatsLoader } from "@/components/StatsLoader";

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] flex flex-col px-4 pb-8">
      {/* Header */}
      <div className="pt-12 pb-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">
            ContaQuiz
          </h1>
          <span className="text-sm font-mono text-slate-500">ARG</span>
        </div>
        <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">
          Práctica de contabilidad — 5 juegos, 4 modos
        </p>
      </div>

      {/* Section label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[11px] font-mono text-slate-600 uppercase tracking-widest">
          Juegos
        </span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Game cards with scores loaded client-side from localStorage */}
      <StatsLoader />

      {/* Footer */}
      <div className="mt-auto pt-10 flex items-center justify-between">
        <span className="text-[11px] text-slate-700 font-mono">
          RT16 · FACPCE · 4000+ ejercicios
        </span>
      </div>
    </main>
  );
}
