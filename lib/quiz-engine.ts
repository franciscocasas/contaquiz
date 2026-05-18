import type {
  Cuenta,
  Transaccion,
  Asiento,
  EjercicioMayor,
  QuizQuestion,
  QuizOption,
  OptionColorKey,
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

// Naturaleza: fixed order, semantic colors
const NATURALEZA_ORDER = ["Activo", "Pasivo", "Ingreso", "Gasto", "Patrimonio Neto"];
const NATURALEZA_COLOR: Record<string, OptionColorKey> = {
  "Activo": "blue",
  "Pasivo": "rose",
  "Ingreso": "emerald",
  "Gasto": "amber",
  "Patrimonio Neto": "violet",
};

export function buildNaturalezaQuestions(cuentas: Cuenta[]): QuizQuestion[] {
  return cuentas.map((c) => {
    const opciones: QuizOption[] = NATURALEZA_ORDER.map((n) => ({
      label: n,
      value: n,
      isCorrect: n === c.naturaleza,
      colorKey: NATURALEZA_COLOR[n],
    }));
    return {
      id: c.id,
      pregunta: `¿Cuál es la naturaleza de "${c.cuenta}"?`,
      opciones,
      explicacion: `${c.cuenta} es ${c.naturaleza}. ${c.notas}`,
      datos: c,
    };
  });
}

// Permutativo: fixed order, semantic colors
export function buildPermutativoQuestions(transacciones: Transaccion[]): QuizQuestion[] {
  return transacciones.map((t) => {
    const isPermutativo = t.tipo === "permutativo";
    const opciones: QuizOption[] = [
      { label: "Permutativo", value: "permutativo", isCorrect: isPermutativo, colorKey: "blue" },
      { label: "Modificativo", value: "modificativo", isCorrect: !isPermutativo, colorKey: "amber" },
    ];
    return {
      id: t.id,
      pregunta: t.descripcion,
      opciones,
      explicacion: t.explicacion,
      datos: t,
    };
  });
}

// Estado: canonical order, semantic colors
// 3-option questions (corriente === null): SP=blue, Resultados=emerald, EvoluciónPN=violet
// 4-option questions (corriente !== null): SP-corriente=blue, SP-no corriente=rose, Resultados=emerald, EvoluciónPN=violet
export function buildEstadoQuestions(cuentas: Cuenta[]): QuizQuestion[] {
  return cuentas.map((c) => {
    const estadoLabel: Record<string, string> = {
      situacion_patrimonial: "Est. Situación Patrimonial",
      resultados: "Estado de Resultados",
      evolucion_pn: "Est. Evolución del PN",
    };

    let pregunta = `¿En qué estado contable aparece "${c.cuenta}"?`;
    if (c.corriente !== null) {
      pregunta += ` ¿Es corriente o no corriente?`;
    }

    let opciones: QuizOption[];

    if (c.corriente === null) {
      opciones = [
        { label: estadoLabel.situacion_patrimonial, value: "situacion_patrimonial", isCorrect: c.estado === "situacion_patrimonial", colorKey: "blue" },
        { label: estadoLabel.resultados, value: "resultados", isCorrect: c.estado === "resultados", colorKey: "emerald" },
        { label: estadoLabel.evolucion_pn, value: "evolucion_pn", isCorrect: c.estado === "evolucion_pn", colorKey: "violet" },
      ];
    } else {
      const correctValue = `${c.estado}__${c.corriente ? "corriente" : "no_corriente"}`;
      opciones = [
        { label: "Est. Situación Patrimonial — Corriente", value: "situacion_patrimonial__corriente", isCorrect: correctValue === "situacion_patrimonial__corriente", colorKey: "blue" },
        { label: "Est. Situación Patrimonial — No Corriente", value: "situacion_patrimonial__no_corriente", isCorrect: correctValue === "situacion_patrimonial__no_corriente", colorKey: "rose" },
        { label: estadoLabel.resultados, value: "resultados", isCorrect: false, colorKey: "emerald" },
        { label: estadoLabel.evolucion_pn, value: "evolucion_pn", isCorrect: false, colorKey: "violet" },
      ];
    }

    const correctLabel = opciones.find((o) => o.isCorrect)!.label;

    return {
      id: c.id,
      pregunta,
      opciones,
      explicacion: `${c.cuenta}: ${correctLabel}. ${c.notas}`,
      datos: c,
    };
  });
}

// Asientos: fixed order — DEBE (blue) first, HABER (amber) second for target account,
// then 2 distractor accounts (emerald, rose)
const ASIENTOS_DISTRACTOR_COLORS: OptionColorKey[] = ["emerald", "rose"];

export function buildAsientosQuestions(asientos: Asiento[]): QuizQuestion[] {
  return asientos.map((a) => {
    const lineas = a.lineas;
    const lineaTarget = lineas[Math.floor(Math.random() * lineas.length)];
    const isDebe = lineaTarget.lado === "debe";

    const resumenCorrecto = lineas
      .map((l) => `${l.cuenta} → ${l.lado === "debe" ? "DEBE" : "HABER"}`)
      .join(" | ");

    const otrasLineas = shuffleArray(
      lineas.filter((l) => l.cuenta !== lineaTarget.cuenta)
    ).slice(0, 2);

    const otrasOpts: QuizOption[] = otrasLineas.map((l, i) => ({
      label: `${l.cuenta} → ${l.lado === "debe" ? "HABER" : "DEBE"}`,
      value: `wrong_${i}`,
      isCorrect: false,
      colorKey: ASIENTOS_DISTRACTOR_COLORS[i],
    }));

    const opciones: QuizOption[] = [
      {
        label: `${lineaTarget.cuenta} → DEBE`,
        value: "target_debe",
        isCorrect: isDebe,
        colorKey: "blue",
      },
      {
        label: `${lineaTarget.cuenta} → HABER`,
        value: "target_haber",
        isCorrect: !isDebe,
        colorKey: "amber",
      },
      ...otrasOpts,
    ];

    return {
      id: a.id,
      pregunta: `${a.escenario}\n\n¿En qué lado va "${lineaTarget.cuenta}"?`,
      opciones,
      explicacion: `${a.pista}\n\nAsiento completo: ${resumenCorrecto}`,
      datos: a,
    };
  });
}

// Mayor: sorted amounts (ascending), positional colors, proper table via tablaAsientos
const MAYOR_COLORS: OptionColorKey[] = ["blue", "emerald", "amber", "rose"];

export function buildMayorQuestions(ejercicios: EjercicioMayor[]): QuizQuestion[] {
  return ejercicios.map((e) => {
    const formatPesos = (n: number) => `$${n.toLocaleString("es-AR")}`;

    // Deduplicate amounts
    const seen = new Set<number>();
    const uniqueAmounts: number[] = [];
    [e.saldo_final, ...e.opciones_distractor].forEach((amt) => {
      if (!seen.has(amt)) {
        seen.add(amt);
        uniqueAmounts.push(amt);
      }
    });
    const sortedAmounts = uniqueAmounts.slice(0, 4).sort((a, b) => a - b);

    const opciones: QuizOption[] = sortedAmounts.map((amt, i) => ({
      label: formatPesos(amt),
      value: `opt_${i}`,
      isCorrect: amt === e.saldo_final,
      colorKey: MAYOR_COLORS[i],
    }));

    return {
      id: e.id,
      pregunta: `${e.titulo}\n¿Cuál es el saldo final de "${e.cuenta_pregunta}"?`,
      opciones,
      explicacion: `DEBE: ${formatPesos(e.saldo_debe)} | HABER: ${formatPesos(e.saldo_haber)} → Saldo ${e.tipo_saldo}: ${formatPesos(e.saldo_final)}`,
      tablaAsientos: e.asientos,
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
