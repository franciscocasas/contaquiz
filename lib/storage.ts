"use client";

import type { GameMode, GameStats, AllStats, ModeScore } from "./types";

const KEY = "contaquiz_stats";
const SEEN_KEY = "contaquiz_seen";

function defaultModeScore(): ModeScore {
  return { best: 0, total: 0, attempts: 0, lastPlayed: null };
}

function defaultGameStats(): GameStats {
  return {
    byMode: {
      rapido: defaultModeScore(),
      estandar: defaultModeScore(),
      maraton: defaultModeScore(),
    },
    survivalRecord: 0,
    survivalAttempts: 0,
  };
}

function load(): AllStats {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function save(stats: AllStats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

export function getGameStats(slug: string): GameStats {
  const all = load();
  return all[slug] ?? defaultGameStats();
}

export function getAllStats(): AllStats {
  const all = load();
  return all;
}

export function saveScore(slug: string, mode: Exclude<GameMode, "survival">, score: number, total: number) {
  const all = load();
  if (!all[slug]) all[slug] = defaultGameStats();
  const m = all[slug].byMode[mode];
  m.attempts += 1;
  m.total = total;
  m.lastPlayed = new Date().toISOString();
  if (score > m.best) m.best = score;
  save(all);
}

export function saveSurvivalRecord(slug: string, streak: number) {
  const all = load();
  if (!all[slug]) all[slug] = defaultGameStats();
  all[slug].survivalAttempts += 1;
  if (streak > all[slug].survivalRecord) all[slug].survivalRecord = streak;
  save(all);
}

export function resetStats() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(SEEN_KEY);
}

// ── Seen IDs tracking (avoid repeating questions across sessions) ─────────────

function loadSeen(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function getSeenIds(slug: string): Set<string> {
  return new Set(loadSeen()[slug] ?? []);
}

export function markSeen(slug: string, ids: string[]) {
  const all = loadSeen();
  const current = new Set(all[slug] ?? []);
  ids.forEach((id) => current.add(id));
  all[slug] = Array.from(current);
  localStorage.setItem(SEEN_KEY, JSON.stringify(all));
}

export function resetSeen(slug: string) {
  const all = loadSeen();
  delete all[slug];
  localStorage.setItem(SEEN_KEY, JSON.stringify(all));
}
