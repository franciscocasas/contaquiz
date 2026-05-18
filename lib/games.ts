import type { GameSlug } from "./types";

export interface GameMeta {
  slug: GameSlug;
  title: string;
  tagline: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const GAMES: GameMeta[] = [
  {
    slug: "naturaleza",
    title: "Naturaleza",
    tagline: "Activo · Pasivo · PN · Ingreso · Gasto",
    description: "Clasificá cada cuenta según su naturaleza contable",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    slug: "permutativo",
    title: "Permutativo / Modificativo",
    tagline: "¿Cambia el Patrimonio Neto?",
    description: "Identificá si la operación afecta o no el PN",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    slug: "estado",
    title: "Estado Contable",
    tagline: "ESP · ER · EEPN · Corriente",
    description: "¿En qué estado aparece? ¿Corriente o no corriente?",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
  },
  {
    slug: "asientos",
    title: "Asientos Contables",
    tagline: "Debe · Haber",
    description: "Completá el asiento contable según el escenario",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    slug: "mayor",
    title: "Libro Mayor",
    tagline: "Saldo deudor · acreedor",
    description: "Calculá el saldo de la cuenta T a partir de los asientos",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
  },
];

export function getGame(slug: string): GameMeta | undefined {
  return GAMES.find((g) => g.slug === slug);
}
