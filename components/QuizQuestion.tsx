"use client";

import { Check, X } from "lucide-react";
import type { QuizQuestion as Question, QuizOption, LineaMayor, OptionColorKey } from "@/lib/types";

interface Props {
  question: Question;
  selected: string | null;
  onSelect: (value: string) => void;
}

export function QuizQuestion({ question, selected, onSelect }: Props) {
  const answered = selected !== null;

  return (
    <div className="flex flex-col gap-5">
      {/* Mayor T-account table */}
      {question.tablaAsientos && (
        <MayorTable asientos={question.tablaAsientos} />
      )}

      {/* Question text */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <p className="text-[15px] text-slate-100 leading-relaxed whitespace-pre-line">
          {question.pregunta}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.opciones.map((opt) => (
          <OptionButton
            key={opt.value}
            option={opt}
            selected={selected === opt.value}
            answered={answered}
            onSelect={() => !answered && onSelect(opt.value)}
          />
        ))}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          className={`
            rounded-2xl p-4 border text-[13px] leading-relaxed
            animate-[fadeSlideUp_0.2s_ease-out]
            ${
              question.opciones.find((o) => o.value === selected)?.isCorrect
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }
          `}
        >
          <p>{question.explicacion}</p>
        </div>
      )}
    </div>
  );
}

// ── Mayor T-account table ────────────────────────────────────────────────────

function MayorTable({ asientos }: { asientos: LineaMayor[] }) {
  const fmt = (n: number) => (n === 0 ? "—" : `$${n.toLocaleString("es-AR")}`);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="px-4 pt-3.5 pb-1.5">
        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Asientos</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] min-w-[320px]">
          <thead>
            <tr className="border-t border-slate-800">
              <th className="text-left px-3 py-2 font-mono text-slate-600 font-normal w-10">Ref.</th>
              <th className="text-left px-3 py-2 font-mono text-slate-600 font-normal">Descripción</th>
              <th className="text-right px-3 py-2 font-mono text-blue-500/70 font-normal w-24">Debe</th>
              <th className="text-right px-3 py-2 font-mono text-amber-500/70 font-normal w-24">Haber</th>
            </tr>
          </thead>
          <tbody>
            {asientos.map((a, i) => (
              <tr key={i} className="border-t border-slate-800/60">
                <td className="px-3 py-2.5 font-mono text-slate-500">{a.ref}</td>
                <td className="px-3 py-2.5 text-slate-300 leading-snug">{a.descripcion}</td>
                <td className="px-3 py-2.5 font-mono text-right text-blue-400/80">{fmt(a.debe)}</td>
                <td className="px-3 py-2.5 font-mono text-right text-amber-400/80">{fmt(a.haber)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Option button ────────────────────────────────────────────────────────────

const COLOR_UNANSWERED: Record<OptionColorKey, string> = {
  blue:    "bg-blue-500/[0.06]    border-blue-500/20    hover:bg-blue-500/10    hover:border-blue-500/30",
  emerald: "bg-emerald-500/[0.06] border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/30",
  amber:   "bg-amber-500/[0.06]   border-amber-500/20   hover:bg-amber-500/10   hover:border-amber-500/30",
  rose:    "bg-rose-500/[0.06]    border-rose-500/20    hover:bg-rose-500/10    hover:border-rose-500/30",
  violet:  "bg-violet-500/[0.06]  border-violet-500/20  hover:bg-violet-500/10  hover:border-violet-500/30",
};

const COLOR_DOT: Record<OptionColorKey, string> = {
  blue:    "bg-blue-400",
  emerald: "bg-emerald-400",
  amber:   "bg-amber-400",
  rose:    "bg-rose-400",
  violet:  "bg-violet-400",
};

interface OptionProps {
  option: QuizOption;
  selected: boolean;
  answered: boolean;
  onSelect: () => void;
}

function OptionButton({ option, selected, answered, onSelect }: OptionProps) {
  const base = `
    w-full min-h-[56px] px-4 py-3.5 rounded-xl text-left text-[14px] leading-snug
    border transition-all duration-150 ease-out
    flex items-center gap-3
    active:scale-[0.98]
  `;

  let stateClasses: string;
  let dotClasses: string;

  if (!answered) {
    stateClasses = `${COLOR_UNANSWERED[option.colorKey]} text-slate-200 cursor-pointer`;
    dotClasses = `w-2 h-2 rounded-full shrink-0 ${COLOR_DOT[option.colorKey]}`;
  } else if (option.isCorrect) {
    stateClasses = "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 cursor-default";
    dotClasses = "";
  } else if (selected) {
    stateClasses = "bg-rose-500/10 border-rose-500/40 text-rose-300 cursor-default";
    dotClasses = "";
  } else {
    stateClasses = "bg-slate-900/30 border-slate-800/50 text-slate-600 cursor-default";
    dotClasses = `w-2 h-2 rounded-full shrink-0 ${COLOR_DOT[option.colorKey]} opacity-20`;
  }

  return (
    <button className={`${base} ${stateClasses}`} onClick={onSelect} disabled={answered}>
      {answered ? (
        <span className="shrink-0 w-3.5 flex items-center justify-center">
          {option.isCorrect ? (
            <Check size={14} className="text-emerald-400" />
          ) : selected ? (
            <X size={14} className="text-rose-400" />
          ) : null}
        </span>
      ) : (
        <span className={dotClasses} />
      )}
      <span>{option.label}</span>
    </button>
  );
}
