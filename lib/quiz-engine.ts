import type {
  Cuenta,
  Transaccion,
  Asiento,
  EjercicioMayor,
  QuizQuestion,
  QuizOption,
  GameMode,
  GameSlug,
} from "./types";
import { GAME_MODE_LENGTHS } from "./types";

// ── Fisher-Yates shuffle ─────────────────────────────────────────────────────

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Pick N items, preferring unseen ─────────────────────────────────────────

export function pickItems<T extends { id: string }>(
  pool: T[],
  n: number,
  seenIds: Set<string>
): T[] {
  const unseen = pool.filter((x) => !seenIds.has(x.id));
  const seen = pool.filter((x) => seenIds.has(x.id));

  if (unseen.length >= n) {
    return shuffleArray(unseen).slice(0, n);
  }

  // Exhausted unseen pool — reset and use all
  const combined = shuffleArray([...unseen, ...seen]);
  return combined.slice(0, Math.min(n, combined.length));
}

// ── Question count by mode ────────────────────────────────────────────────────

export function getQuestionCount(mode: GameMode): number | null {
  if (mode === "survival") return null;
  return GAME_MODE_LENGTHS[mode];
}

// ── Build questions per game type ─────────────────────────────────────────────

export function buildNaturalezaQuestions(cuentas: Cuenta[]): QuizQuestion[] {
  const naturalezas = ["Activo", "Pasivo", "Ingreso", "Gasto", "Patrimonio Neto"];

  return cuentas.map((c) => {
    const wrong = shuffleArray(naturalezas.filter((n) => n !== c.naturaleza)).slice(0, 3);
    const opciones: QuizOption[] = shuffleArray([
      { label: c.naturaleza, value: c.naturaleza, isCorrect: true },
      ...wrong.map((w) => ({ label: w, value: w, isCorrect: false })),
    ]);
    return {
      id: c.id,
      pregunta: `¿Cuál es la naturaleza de "${c.cuenta}"?`,
      opciones,
      explicacion: `${c.cuenta} es ${c.naturaleza}. ${c.notas}`,
      datos: c,
    };
  });
}

export function buildPermutativoQuestions(transacciones: Transaccion[]): QuizQuestion[] {
  return transacciones.map((t) => {
    const isPermutativo = t.tipo === "permutativo";
    const opciones: QuizOption[] = shuffleArray([
      { label: "Permutativo", value: "permutativo", isCorrect: isPermutativo },
      { label: "Modificativo", value: "modificativo", isCorrect: !isPermutativo },
    ]);
    return {
      id: t.id,
      pregunta: t.descripcion,
      opciones,
      explicacion: t.explicacion,
      datos: t,
    };
  });
}

export function buildEstadoQuestions(cuentas: Cuenta[]): QuizQuestion[] {
  const estados = [
    { value: "situacion_patrimonial", label: "Est. Situación Patrimonial" },
    { value: "resultados", label: "Estado de Resultados" },
    { value: "evolucion_pn", label: "Est. Evolución del PN" },
  ];

  return cuentas.map((c) => {
    const correctLabel = estados.find((e) => e.value === c.estado)!.label;
    const wrong = shuffleArray(estados.filter((e) => e.value !== c.estado)).slice(0, 2);

    let pregunta = `¿En qué estado contable aparece "${c.cuenta}"?`;
    if (c.corriente !== null) {
      pregunta += ` ¿Es corriente o no corriente?`;
    }

    const correctValue = c.corriente === null
      ? c.estado
      : `${c.estado}__${c.corriente ? "corriente" : "no_corriente"}`;

    const correctLabelFull = c.corriente === null
      ? correctLabel
      : `${correctLabel} — ${c.corriente ? "Corriente" : "No Corriente"}`;

    const wrongOptions: QuizOption[] = wrong.map((w) => ({
      label: w.label,
      value: w.value,
      isCorrect: false,
    }));

    // Add a corriente/no-corriente distractor if applicable
    if (c.corriente !== null) {
      wrongOptions.push({
        label: `${correctLabel} — ${c.corriente ? "No Corriente" : "Corriente"}`,
        value: `${c.estado}__${c.corriente ? "no_corriente" : "corriente"}`,
        isCorrect: false,
      });
    }

    const opciones: QuizOption[] = shuffleArray([
      { label: correctLabelFull, value: correctValue, isCorrect: true },
      ...wrongOptions.slice(0, 3),
    ]);

    return {
      id: c.id,
      pregunta,
      opciones,
      explicacion: `${c.cuenta}: ${correctLabelFull}. ${c.notas}`,
      datos: c,
    };
  });
}

export function buildAsientosQuestions(asientos: Asiento[]): QuizQuestion[] {
  return asientos.map((a) => {
    // For each account in the asiento, ask if it goes Debe or Haber
    // Build options based on all accounts in the asiento
    const lineas = a.lineas;

    // Pick one random line to ask about
    const lineaTarget = lineas[Math.floor(Math.random() * lineas.length)];
    const correctLabel = lineaTarget.lado === "debe" ? "Debe" : "Haber";
    const wrongLabel = lineaTarget.lado === "debe" ? "Haber" : "Debe";

    // Also build a summary option showing the full entry
    const resumenCorrecto = lineas
      .map((l) => `${l.cuenta} → ${l.lado === "debe" ? "DEBE" : "HABER"}`)
      .join(" | ");

    const opciones: QuizOption[] = shuffleArray([
      {
        label: `${lineaTarget.cuenta} → ${correctLabel.toUpperCase()}`,
        value: "correct",
        isCorrect: true,
      },
      {
        label: `${lineaTarget.cuenta} → ${wrongLabel.toUpperCase()}`,
        value: "wrong1",
        isCorrect: false,
      },
      ...shuffleArray(lineas.filter((l) => l.cuenta !== lineaTarget.cuenta))
        .slice(0, 2)
        .map((l, i) => ({
          label: `${l.cuenta} → ${l.lado === "debe" ? "HABER" : "DEBE"}`,
          value: `wrong${i + 2}`,
          isCorrect: false,
        })),
    ]).slice(0, 4);

    return {
      id: a.id,
      pregunta: `${a.escenario}\n\n¿En qué lado va "${lineaTarget.cuenta}"?`,
      opciones,
      explicacion: `${a.pista}\n\nAsiento completo: ${resumenCorrecto}`,
      datos: a,
    };
  });
}

export function buildMayorQuestions(ejercicios: EjercicioMayor[]): QuizQuestion[] {
  return ejercicios.map((e) => {
    const formatPesos = (n: number) =>
      `$${n.toLocaleString("es-AR")}`;

    const correctLabel = `${formatPesos(e.saldo_final)} (${e.tipo_saldo})`;

    const distractores = shuffleArray(e.opciones_distractor).slice(0, 3).map((d, i) => ({
      label: formatPesos(d),
      value: `dist_${i}`,
      isCorrect: false,
    }));

    const asientosTexto = e.asientos
      .map((a) => `${a.ref}: ${a.descripcion} — D: $${a.debe.toLocaleString("es-AR")} H: $${a.haber.toLocaleString("es-AR")}`)
      .join("\n");

    const opciones: QuizOption[] = shuffleArray([
      { label: correctLabel, value: "correct", isCorrect: true },
      ...distractores,
    ]);

    return {
      id: e.id,
      pregunta: `${e.titulo}\n\n${asientosTexto}\n\n¿Cuál es el saldo de "${e.cuenta_pregunta}"?`,
      opciones,
      explicacion: `Debe: $${e.saldo_debe.toLocaleString("es-AR")} | Haber: $${e.saldo_haber.toLocaleString("es-AR")} → Saldo ${e.tipo_saldo}: ${formatPesos(e.saldo_final)}`,
      datos: e,
    };
  });
}

// ── Main entry: get N quiz questions for a game ───────────────────────────────

export async function fetchGameData(slug: GameSlug) {
  const urls: Record<GameSlug, string> = {
    naturaleza: "/data/cuentas.json",
    permutativo: "/data/transacciones.json",
    estado: "/data/cuentas.json",
    asientos: "/data/asientos.json",
    mayor: "/data/mayor.json",
  };
  const res = await fetch(urls[slug]);
  return res.json();
}

export function buildQuestions(slug: GameSlug, data: unknown[]): QuizQuestion[] {
  switch (slug) {
    case "naturaleza":
      return buildNaturalezaQuestions(data as Cuenta[]);
    case "permutativo":
      return buildPermutativoQuestions(data as Transaccion[]);
    case "estado":
      return buildEstadoQuestions(data as Cuenta[]);
    case "asientos":
      return buildAsientosQuestions(data as Asiento[]);
    case "mayor":
      return buildMayorQuestions(data as EjercicioMayor[]);
    default:
      return [];
  }
}
