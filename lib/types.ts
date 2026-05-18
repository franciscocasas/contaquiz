export type Naturaleza = "Activo" | "Pasivo" | "Ingreso" | "Gasto" | "Patrimonio Neto";
export type EstadoContable = "situacion_patrimonial" | "resultados" | "evolucion_pn";
export type TipoTransaccion = "permutativo" | "modificativo_positivo" | "modificativo_negativo";
export type SubtipoTransaccion = TipoTransaccion;
export type NivelDificultad = "basico" | "intermedio" | "avanzado";
export type LadoAsiento = "debe" | "haber";
export type TipoSaldo = "deudor" | "acreedor";

export type GameMode = "rapido" | "estandar" | "maraton" | "survival";
export const GAME_MODE_LENGTHS: Record<Exclude<GameMode, "survival">, number> = {
  rapido: 10,
  estandar: 25,
  maraton: 50,
};

export type GameSlug = "naturaleza" | "permutativo" | "estado" | "asientos" | "mayor";

// ── Data types ──────────────────────────────────────────────────────────────

export interface Cuenta {
  id: string;
  cuenta: string;
  naturaleza: Naturaleza;
  rubro: string;
  subrubro: string;
  estado: EstadoContable;
  corriente: boolean | null;
  esRegularizador: boolean;
  notas: string;
}

export interface Transaccion {
  id: string;
  descripcion: string;
  tipo: "permutativo" | "modificativo";
  subtipo: SubtipoTransaccion;
  explicacion: string;
  cuentas_involucradas: string[];
}

export interface LineaAsiento {
  cuenta: string;
  lado: LadoAsiento;
  importe: number;
}

export interface Asiento {
  id: string;
  nivel: NivelDificultad;
  escenario: string;
  pista: string;
  lineas: LineaAsiento[];
}

export interface LineaMayor {
  ref: string;
  descripcion: string;
  debe: number;
  haber: number;
}

export interface EjercicioMayor {
  id: string;
  nivel: NivelDificultad;
  titulo: string;
  cuenta_pregunta: string;
  asientos: LineaMayor[];
  saldo_debe: number;
  saldo_haber: number;
  saldo_final: number;
  tipo_saldo: TipoSaldo;
  opciones_distractor: number[];
}

// ── Quiz types ───────────────────────────────────────────────────────────────

export interface QuizOption {
  label: string;
  value: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  pregunta: string;
  opciones: QuizOption[];
  explicacion: string;
  datos?: Cuenta | Transaccion | Asiento | EjercicioMayor;
}

// ── Storage types ────────────────────────────────────────────────────────────

export interface ModeScore {
  best: number;
  total: number;
  attempts: number;
  lastPlayed: string | null;
}

export interface GameStats {
  byMode: Record<Exclude<GameMode, "survival">, ModeScore>;
  survivalRecord: number;
  survivalAttempts: number;
}

export interface AllStats {
  [slug: string]: GameStats;
}
