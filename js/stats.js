// Cálculos de progreso: 1RM estimado, récords y volumen.

// % del 1RM según repeticiones (misma tabla que usa Hevy). Más de 30 reps → 50 %.
const PCT = { 1: 1, 2: .97, 3: .94, 4: .92, 5: .89, 6: .86, 7: .83, 8: .81, 9: .78, 10: .75,
  11: .73, 12: .71, 13: .7, 14: .68, 15: .67, 16: .65, 17: .64, 18: .63, 19: .61, 20: .6,
  21: .59, 22: .58, 23: .57, 24: .56, 25: .55, 26: .54, 27: .53, 28: .52, 29: .51, 30: .5 };

export const e1rm = (w, r) => {
  if (!w || !r || r < 1) return 0;
  return w / (r > 30 ? 0.5 : PCT[Math.round(r)]);
};

// Clave estable de un ejercicio a partir de su nombre ("Press de Banca" → "press-de-banca").
// Así el mismo ejercicio en días distintos comparte historial.
export const key = (name) => String(name).toLowerCase().normalize("NFD")
  .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const parseReps = (t) => { const m = String(t ?? "").match(/\d+/); return m ? +m[0] : null; };

const byDate = (sessions) => [...sessions].sort((a, b) => a.start - b.start);

export function lastFor(sessions, k) {
  const list = byDate(sessions);
  for (let i = list.length - 1; i >= 0; i--) {
    const e = list[i].exercises.find((x) => x.key === k);
    if (e) return e;
  }
  return null;
}

// Métricas de un ejercicio dentro de una sesión (los calentamientos no cuentan).
export function metrics(ex) {
  const m = { maxWeight: 0, best1rm: 0, bestSetVol: 0, maxReps: 0, maxSeconds: 0, volume: 0, sets: 0 };
  for (const s of ex.sets) {
    if (s.kind === "warmup") continue;
    const w = s.weight || 0, r = s.reps || 0;
    m.sets++;
    m.maxWeight = Math.max(m.maxWeight, w);
    m.best1rm = Math.max(m.best1rm, e1rm(w, r));
    m.bestSetVol = Math.max(m.bestSetVol, w * r);
    m.maxReps = Math.max(m.maxReps, r);
    m.maxSeconds = Math.max(m.maxSeconds, s.seconds || 0);
    m.volume += w * r;
  }
  return m;
}

export function history(sessions, k) {
  return byDate(sessions).flatMap((s) => {
    const ex = s.exercises.find((x) => x.key === k);
    return ex ? [{ session: s, ex, m: metrics(ex) }] : [];
  });
}

export function records(sessions, k, before = Infinity) {
  const r = { maxWeight: 0, best1rm: 0, bestSetVol: 0, maxReps: 0, maxSeconds: 0 };
  for (const h of history(sessions, k)) {
    if (h.session.start >= before) continue;
    for (const f in r) r[f] = Math.max(r[f], h.m[f]);
  }
  return r;
}

export const PR_LABELS = { maxWeight: "Peso máx.", best1rm: "1RM est.", bestSetVol: "Mejor serie", maxReps: "Más reps", maxSeconds: "Más tiempo" };
export const prFields = (type) =>
  type === "check" ? [] : type === "duration" ? ["maxSeconds"] : type === "reps_only" ? ["maxReps"] : ["maxWeight", "best1rm", "bestSetVol"];

// Récords batidos en una sesión, comparando con las sesiones anteriores a ella.
export function sessionPRs(sessions, session) {
  const out = {};
  for (const ex of session.exercises) {
    const before = history(sessions, ex.key).filter((h) => h.session.start < session.start);
    if (!before.length) continue; // primera vez: no hay con qué comparar
    const prev = records(sessions, ex.key, session.start);
    const m = metrics(ex);
    const beaten = prFields(ex.type).filter((f) => m[f] > prev[f] + 1e-9).map((f) => PR_LABELS[f]);
    if (beaten.length) out[ex.key] = beaten;
  }
  return out;
}

export const sessionVolume = (s) => s.exercises.reduce((a, e) => a + metrics(e).volume, 0);
export const sessionSets = (s) => s.exercises.reduce((a, e) => a + metrics(e).sets, 0);
