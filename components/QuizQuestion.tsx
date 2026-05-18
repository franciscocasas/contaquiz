"use client";

import { Check, X } from "lucide-react";
import type { QuizQuestion as Question, QuizOption } from "@/lib/types";

interface Props {
  question: Question;
  selected: string | null;
  onSelect: (value: string) => void;
}

export function QuizQuestion({ question, selected, onSelect }: Props) {
  const answered = selected !== null;

  return (
    <div className="flex flex-col gap-5">
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

interface OptionProps {
  option: QuizOption;
  selected: boolean;
  answered: boolean;
  onSelect: () => void;
}

function OptionButton({ option, selected, answered, onSelect }: OptionProps) {
  let classes = `
    w-full min-h-[56px] px-4 py-3.5 rounded-xl text-left text-[14px] leading-snug
    border transition-all duration-150 ease-out
    flex items-center gap-3
    active:scale-[0.98]
  `;

  if (!answered) {
    classes += " bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-100 cursor-pointer";
  } else if (option.isCorrect) {
    classes += " bg-emerald-500/10 border-emerald-500/40 text-emerald-300 cursor-default";
  } else if (selected && !option.isCorrect) {
    classes += " bg-rose-500/10 border-rose-500/40 text-rose-300 cursor-default";
  } else {
    classes += " bg-slate-900/30 border-slate-800/50 text-slate-600 cursor-default";
  }

  return (
    <button className={classes} onClick={onSelect} disabled={answered}>
      {answered && (
        <span className="shrink-0">
          {option.isCorrect ? (
            <Check size={14} className="text-emerald-400" />
          ) : selected ? (
            <X size={14} className="text-rose-400" />
          ) : (
            <span className="w-3.5 h-3.5 block" />
          )}
        </span>
      )}
      <span>{option.label}</span>
    </button>
  );
}
