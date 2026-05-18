# ContaQuiz — Instrucciones del proyecto

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4 + shadcn/ui v4
- Service worker manual (public/sw.js) para PWA
- JSON estático en public/data/ para datos del juego
- localStorage para progreso y scores

## SIEMPRE mobile-first
- Viewport base: 375px (iPhone SE)
- Touch targets: mínimo 56px height (clase `touch-target`)
- Sin hover-only — todo funciona con tap
- Texto mínimo 16px (evita zoom iOS)
- No tablas complejas en mobile — usar cards apiladas

## Datos
- `public/data/cuentas.json` — 1000 cuentas argentinas
- `public/data/transacciones.json` — 1000 escenarios permutativo/modificativo
- `public/data/asientos.json` — 1000 asientos
- `public/data/mayor.json` — 1000 ejercicios libro mayor
- Schema en `lib/types.ts`
- NUNCA hardcodear datos en componentes

## Terminología argentina (siempre)
- "Debe/Haber" no "Debit/Credit"
- "Estado de Situación Patrimonial" (no Balance Sheet)
- "Estado de Resultados" (no Income Statement)
- "Patrimonio Neto" / "PN" (no Equity)
- Moneda: pesos argentinos ($)
- Activo Regularizador: cuenta que RESTA del activo (ej. Previsión Ds Incobrables)

## Los 5 juegos (slugs)
- `/game/naturaleza` — Activo/Pasivo/Ingreso/Gasto/PN
- `/game/permutativo` — Permutativo vs Modificativo
- `/game/estado` — Estado contable + corriente/no corriente
- `/game/asientos` — Completar Debe/Haber
- `/game/mayor` — Saldo en cuenta T

## Modos de juego
- Rápido: 10 preguntas
- Estándar: 25 preguntas
- Maratón: 50 preguntas
- Survival: hasta el primer error (guarda record de racha)

## Estructura clave
- `lib/types.ts` — interfaces de datos
- `lib/quiz-engine.ts` — getRandomQuestions, generateOptions, markSeen
- `lib/storage.ts` — localStorage helpers
- `components/ui/` — shadcn components
- `components/` — componentes de la app

## Skills que se aplican automáticamente
- design-taste-frontend (shadcn/ui + Tailwind, mobile-first)
