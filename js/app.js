// App principal: enrutador por hash (#/ruta), pantallas y acciones.
import { state, save, uid, resetRoutine, importBackup, wipe } from "./store.js";
import * as S from "./stats.js";
import * as T from "./timer.js";
import { GUIA, CATEGORIAS, guiaPorId } from "./guia.js";

const app = document.getElementById("app");
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const TIPOS = { weight_reps: "Peso y reps", reps_only: "Solo reps", duration: "Tiempo", check: "Solo marcar" };
const KINDS = ["normal", "warmup", "dropset", "failure"];
const KIND_NAME = { normal: "Normal", warmup: "Calentamiento", dropset: "Dropset", failure: "Al fallo" };
const NAV_OF = { "": "", dia: "", entreno: "", historial: "historial", sesion: "historial", progreso: "progreso", ejercicio: "progreso", guia: "guia", ajustes: "ajustes" };

let editMode = false, editNext = false, ticker = null, wakeLock = null;

// ---------- utilidades ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (v) => { const n = parseFloat(String(v).replace(",", ".")); return Number.isFinite(n) ? n : null; };
const pad = (n) => String(n).padStart(2, "0");
const clock = (sec) => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`; };
const kg = (n) => (Math.round((n || 0) * 10) / 10).toLocaleString("es");
const fmtDate = (ts) => new Date(ts).toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
const route = () => { const [, view = "", p] = location.hash.split("/"); return { view, param: p ? decodeURIComponent(p) : null }; };
const currentDay = () => state.routine.days.find((d) => d.id === route().param);
const markEdited = () => { state.routineEdited = true; save(); };

// ---------- semanas del programa ----------
const WEEKS = 12, DAY_MS = 864e5;
const mondayOf = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
const programWeek = () => Math.min(WEEKS, Math.max(1, Math.round((mondayOf(Date.now()) - state.programStart) / (7 * DAY_MS)) + 1));
const hasWeekly = (d) => d.exercises.some((e) => e.weekly);

// Devuelve el ejercicio con los objetivos de la semana actual aplicados (si tiene `weekly`).
function resolve(ex) {
  if (!ex.weekly) return ex;
  const w = programWeek(), wk = ex.weekly, at = (arr) => arr[Math.min(w, arr.length) - 1];
  const r = { ...ex };
  if (wk.reps) r.reps = String(at(wk.reps));
  if (wk.sets) r.sets = at(wk.sets);
  if (wk.goal) r.sets = 1;
  const nk = Object.keys(wk.notes || {}).map(Number).filter((n) => n <= w).sort((a, b) => a - b).pop();
  if (nk) r.notes = [ex.notes, wk.notes[nk]].filter(Boolean).join(" ");
  return r;
}

function fmtSet(type, s) {
  if (type === "check") return "Hecho";
  if (type === "duration") return clock(s.seconds || 0);
  if (type === "reps_only") return `${s.reps ?? 0} reps`;
  return `${kg(s.weight)} kg × ${s.reps ?? 0}`;
}

function target(ex) {
  ex = resolve(ex);
  if (ex.weekly?.goal) return `Objetivo semana ${programWeek()}: ${ex.reps} reps en total`;
  if (ex.type === "check") return `${ex.sets || 1} ${ex.sets > 1 ? "rondas" : "ronda"}${ex.rest ? ` · descanso ${clock(ex.rest)}` : ""}`;
  const amount = ex.type === "duration" ? (ex.seconds ? clock(ex.seconds) : "") : (ex.reps || "");
  const parts = [`${ex.sets || 1} × ${amount}`.trim()];
  if (ex.type === "weight_reps" && ex.weight) parts.push(`${kg(ex.weight)} kg`);
  if (ex.rest) parts.push(`descanso ${clock(ex.rest)}`);
  if (ex.warmup) parts.unshift("Calentamiento");
  if (ex.weekly) parts.unshift(`Semana ${programWeek()}`);
  return parts.join(" · ");
}

const lastDone = (dayId) => state.sessions.filter((s) => s.dayId === dayId).sort((a, b) => b.start - a.start)[0];

function bestLine(k, type) {
  const r = S.records(state.sessions, k);
  if (type === "check") return "";
  if (type === "duration") return r.maxSeconds ? `<span class="pr-line">Récord: ${clock(r.maxSeconds)}</span>` : "";
  if (type === "reps_only") return r.maxReps ? `<span class="pr-line">Récord: ${r.maxReps} reps</span>` : "";
  return r.maxWeight ? `<span class="pr-line">Récord: ${kg(r.maxWeight)} kg · 1RM est. ${kg(r.best1rm)} kg</span>` : "";
}

// Botones que llevan a la guía del ejercicio (uno por cada id de `guia`).
function guiaBtns(ids) {
  const gs = (ids || []).map(guiaPorId).filter(Boolean);
  if (!gs.length) return "";
  return `<div class="guia-links">${gs.map((g) =>
    `<a class="chip" href="#/guia/${g.id}">ⓘ ${gs.length > 1 ? esc(g.nombre.split(" (")[0]) : "Ver cómo se hace"}</a>`).join("")}</div>`;
}

// ---------- pantallas ----------
function home() {
  const r = state.routine, today = new Date().getDay();
  const hoy = r.days.find((d) => d.weekday === today);
  let h = `<header class="top"><h1>Hoy</h1><p class="muted">${DIAS[today]}, ${new Date().toLocaleDateString("es", { day: "numeric", month: "long" })}</p></header>`;
  if (state.active) h += `<a class="card accent" href="#/entreno"><strong>Entreno en curso</strong><span>${esc(state.active.title)} · continuar →</span></a>`;
  h += hoy ? dayCard(hoy, true)
    : `<div class="card"><strong>Día de descanso</strong><span class="muted small">No hay entreno asignado para hoy. Puedes elegir cualquier día de la semana.</span></div>`;
  h += `<h2>${esc(r.name)}</h2>${r.days.map((d) => dayCard(d, false)).join("")}`;
  h += `<button class="btn block ghost" data-action="day-add">+ Añadir día</button>`;
  return h;
}

function dayCard(d, big) {
  const last = lastDone(d.id);
  return `<a class="card ${big ? "big" : ""}" href="#/dia/${encodeURIComponent(d.id)}">
      <div class="row"><span class="tag">${d.weekday != null ? DIAS[d.weekday] : "Sin día fijo"}</span>${last ? `<span class="muted small">hecho ${fmtDate(last.start)}</span>` : ""}</div>
      <strong>${esc(d.title)}</strong>
      <span class="muted small">${d.exercises.length} ejercicios${big ? " · " + d.exercises.map((e) => esc(e.name)).join(", ") : ""}</span>
    </a>
    ${big && !state.active ? `<button class="btn primary block" data-action="start" data-day="${esc(d.id)}">Empezar entreno</button>` : ""}`;
}

function day() {
  const d = currentDay();
  if (!d) return notFound();
  if (editMode) return dayEdit(d);
  return `<header class="top"><a href="#/" class="back">‹ Hoy</a><h1>${esc(d.title)}</h1><p class="muted">${d.weekday != null ? DIAS[d.weekday] : "Sin día fijo"}${hasWeekly(d) ? ` · semana ${programWeek()} de ${WEEKS}` : ""}</p></header>
    ${d.exercises.length ? d.exercises.map((e, i) => `<div class="card">
        <strong>${i + 1}. ${esc(e.name)}</strong>
        <span class="muted small">${esc(target(e))}</span>
        ${resolve(e).notes ? `<p class="note">${esc(resolve(e).notes)}</p>` : ""}
        ${guiaBtns(e.guia)}
        ${bestLine(S.key(e.name), e.type)}
      </div>`).join("") : `<p class="muted">Este día no tiene ejercicios todavía.</p>`}
    <div class="actions">
      ${state.active ? `<a class="btn primary" href="#/entreno">Continuar entreno en curso</a>`
        : `<button class="btn primary" data-action="start" data-day="${esc(d.id)}" ${d.exercises.length ? "" : "disabled"}>Empezar entreno</button>`}
      <button class="btn" data-action="edit-on">Editar día</button>
    </div>`;
}

function dayEdit(d) {
  const opt = (v, label, sel) => `<option value="${v}" ${sel ? "selected" : ""}>${label}</option>`;
  return `<header class="top"><h1>Editar día</h1></header>
    <label class="field">Nombre del día<input data-field="day" data-k="title" value="${esc(d.title)}"></label>
    <label class="field">Día de la semana<select data-field="day" data-k="weekday">
      ${opt("", "— Sin día fijo —", d.weekday == null)}${DIAS.map((n, i) => opt(i, n, d.weekday === i)).join("")}
    </select></label>
    ${d.exercises.map((e, i) => `<div class="card edit">
      <div class="row"><strong>Ejercicio ${i + 1}</strong><span class="icons">
        <button class="icon" data-action="ex-move" data-i="${i}" data-d="-1" aria-label="Subir">↑</button>
        <button class="icon" data-action="ex-move" data-i="${i}" data-d="1" aria-label="Bajar">↓</button>
        <button class="icon danger" data-action="ex-del" data-i="${i}" aria-label="Eliminar">✕</button></span></div>
      <label class="field">Nombre<input data-field="rx" data-i="${i}" data-k="name" value="${esc(e.name)}"></label>
      ${e.weekly ? `<p class="muted small">Series y reps cambian cada semana (definidas en la rutina). Ahora: ${esc(target(e))}</p>` : `<div class="grid">
        <label class="field">Tipo<select data-field="rx" data-i="${i}" data-k="type">${Object.entries(TIPOS).map(([v, l]) => opt(v, l, e.type === v)).join("")}</select></label>
        <label class="field">Series<input inputmode="numeric" data-field="rx" data-i="${i}" data-k="sets" value="${e.sets ?? ""}"></label>
        ${e.type === "duration"
          ? `<label class="field">Segundos<input inputmode="numeric" data-field="rx" data-i="${i}" data-k="seconds" value="${e.seconds ?? ""}"></label>`
          : e.type === "check" ? "" : `<label class="field">Reps<input data-field="rx" data-i="${i}" data-k="reps" value="${esc(e.reps)}" placeholder="8-10"></label>`}
        ${e.type === "weight_reps" ? `<label class="field">Peso (kg)<input inputmode="decimal" data-field="rx" data-i="${i}" data-k="weight" value="${e.weight ?? ""}"></label>` : ""}
        <label class="field">Descanso (s)<input inputmode="numeric" data-field="rx" data-i="${i}" data-k="rest" value="${e.rest ?? ""}"></label>
      </div>`}
      <label class="field">Notas<input data-field="rx" data-i="${i}" data-k="notes" value="${esc(e.notes)}"></label>
    </div>`).join("")}
    <button class="btn block" data-action="ex-add">+ Añadir ejercicio</button>
    <div class="actions"><button class="btn primary" data-action="edit-off">Listo</button><button class="btn danger" data-action="day-del">Eliminar día</button></div>`;
}

function workout() {
  const a = state.active;
  if (!a) return `<header class="top"><h1>Sin entreno en curso</h1></header><a class="btn primary block" href="#/">Ir a Hoy</a>`;
  const all = a.exercises.flatMap((e) => e.sets), done = all.filter((s) => s.done).length;
  return `<header class="top sticky"><div class="row">
      <div><h1>${esc(a.title)}</h1><p class="muted"><span id="elapsed">${clock((Date.now() - a.start) / 1000)}</span> · ${done}/${all.length} series</p></div>
      <button class="btn primary" data-action="finish">Terminar</button></div></header>
    ${a.exercises.map(exerciseBlock).join("")}
    <button class="btn block" data-action="wex-add">+ Añadir ejercicio</button>
    <button class="btn block danger ghost" data-action="cancel">Descartar entreno</button>`;
}

function exerciseBlock(e, ei) {
  const cols = e.type === "weight_reps" ? ["kg", "reps"] : e.type === "reps_only" ? ["reps"] : e.type === "check" ? [] : ["seg"];
  const doneReps = e.sets.filter((s) => s.done).reduce((a, s) => a + (s.reps || 0), 0);
  const goal = e.goal ? `<div class="goal ${doneReps >= e.goal ? "ok" : ""}"><span>Llevas <b>${doneReps}</b> / ${e.goal} reps${doneReps >= e.goal ? " · ¡misión cumplida!" : ""}</span>
      <span class="goal-bar"><i style="width:${Math.min(100, (doneReps / e.goal) * 100)}%"></i></span></div>` : "";
  let n = 0;
  const rows = e.sets.map((s, si) => {
    const label = s.kind === "warmup" ? "C" : s.kind === "dropset" ? "D" : s.kind === "failure" ? "F" : String(++n);
    const p = e.prev[si];
    const inp = (k, mode) => `<input class="num" type="text" inputmode="${mode}" data-field="set" data-ei="${ei}" data-si="${si}" data-k="${k}" value="${s[k] ?? ""}" aria-label="${k}">`;
    const cells = e.type === "weight_reps" ? inp("weight", "decimal") + inp("reps", "numeric")
      : e.type === "reps_only" ? inp("reps", "numeric") : e.type === "check" ? "" : inp("seconds", "numeric");
    return `<div class="set ${s.done ? "done" : ""}">
      <button class="kind k-${s.kind}" data-action="set-kind" data-ei="${ei}" data-si="${si}" title="${KIND_NAME[s.kind]} (toca para cambiar)">${label}</button>
      <span class="prev">${p ? esc(fmtSet(e.type, p)) : "—"}</span>${cells}
      <button class="check" data-action="set-done" data-ei="${ei}" data-si="${si}" aria-label="Marcar serie">✓</button>
    </div>`;
  }).join("");
  return `<section class="card ex">
    <strong>${esc(e.name)}</strong>
    <span class="muted small">${esc(e.target)}</span>
    ${e.notes ? `<p class="note">${esc(e.notes)}</p>` : ""}
    ${guiaBtns(e.guia)}
    ${goal}
    <div class="sets t-${e.type}">
      <div class="set head"><span>Serie</span><span>Anterior</span>${cols.map((c) => `<span>${c}</span>`).join("")}<span></span></div>
      ${rows}
    </div>
    <div class="row gap"><button class="btn small" data-action="set-add" data-ei="${ei}">+ Serie</button><button class="btn small ghost" data-action="set-del" data-ei="${ei}">− Serie</button></div>
  </section>`;
}

function historyView() {
  const list = [...state.sessions].sort((a, b) => b.start - a.start);
  const week = list.filter((s) => s.start >= mondayOf(Date.now()));
  return `<header class="top"><h1>Historial</h1></header>
    <div class="stats3">
      <div><b>${week.length}</b><span>entrenos esta semana</span></div>
      <div><b>${kg(week.reduce((a, s) => a + S.sessionVolume(s), 0))}</b><span>kg de volumen</span></div>
      <div><b>${list.length}</b><span>entrenos en total</span></div>
    </div>
    ${list.length ? list.map((s) => `<a class="card" href="#/sesion/${s.id}">
        <div class="row"><strong>${esc(s.title)}</strong><span class="muted small">${fmtDate(s.start)}</span></div>
        <span class="muted small">${clock((s.end - s.start) / 1000)} · ${S.sessionSets(s)} series · ${kg(S.sessionVolume(s))} kg</span>
      </a>`).join("") : `<p class="muted">Aún no has terminado ningún entreno.</p>`}`;
}

function sessionView() {
  const s = state.sessions.find((x) => x.id === route().param);
  if (!s) return notFound();
  const prs = S.sessionPRs(state.sessions, s);
  const nPR = Object.values(prs).flat().length;
  return `<header class="top"><a href="#/historial" class="back">‹ Historial</a><h1>${esc(s.title)}</h1>
      <p class="muted">${new Date(s.start).toLocaleString("es", { dateStyle: "full", timeStyle: "short" })}</p></header>
    <div class="stats3">
      <div><b>${clock((s.end - s.start) / 1000)}</b><span>duración</span></div>
      <div><b>${kg(S.sessionVolume(s))}</b><span>kg de volumen</span></div>
      <div><b>${nPR}</b><span>récords</span></div>
    </div>
    ${s.exercises.map((e) => `<a class="card" href="#/ejercicio/${e.key}">
      <div class="row"><strong>${esc(e.name)}</strong>${(prs[e.key] || []).map((p) => `<span class="badge">🏆 ${p}</span>`).join("")}</div>
      <ol class="setlist">${e.sets.map((x) => `<li>${x.kind !== "normal" ? `<span class="kind-txt">${KIND_NAME[x.kind]}</span> ` : ""}${esc(fmtSet(e.type, x))}${e.type === "weight_reps" && x.reps ? ` <span class="muted small">(1RM ${kg(S.e1rm(x.weight, x.reps))})</span>` : ""}</li>`).join("")}</ol>
    </a>`).join("")}
    <button class="btn block danger ghost" data-action="session-del">Eliminar este entreno</button>`;
}

function progress() {
  const map = new Map();
  for (const s of [...state.sessions].sort((a, b) => a.start - b.start))
    for (const e of s.exercises) map.set(e.key, { name: e.name, type: e.type, last: s.start });
  const items = [...map.entries()].sort((a, b) => b[1].last - a[1].last);
  return `<header class="top"><h1>Progreso</h1><p class="muted">Récords e historial por ejercicio</p></header>
    ${items.length ? items.map(([k, v]) => `<a class="card" href="#/ejercicio/${k}">
        <div class="row"><strong>${esc(v.name)}</strong><span class="muted small">${fmtDate(v.last)}</span></div>
        ${bestLine(k, v.type)}
      </a>`).join("") : `<p class="muted">Cuando termines tu primer entreno, aquí verás tus récords.</p>`}`;
}

function exerciseView() {
  const k = route().param, hist = S.history(state.sessions, k);
  if (!hist.length) return notFound();
  const { name, type } = hist.at(-1).ex;
  const r = S.records(state.sessions, k);
  const tiles = type === "duration" ? [["Más tiempo", clock(r.maxSeconds)]]
    : type === "reps_only" ? [["Más reps", r.maxReps]]
    : [["Peso máx.", `${kg(r.maxWeight)} kg`], ["1RM est.", `${kg(r.best1rm)} kg`], ["Mejor serie", `${kg(r.bestSetVol)} kg`]];
  const field = type === "duration" ? "maxSeconds" : type === "reps_only" ? "maxReps" : "best1rm";
  const unit = type === "duration" ? "s" : type === "reps_only" ? "reps" : "kg (1RM est.)";
  return `<header class="top"><a href="#/progreso" class="back">‹ Progreso</a><h1>${esc(name)}</h1><p class="muted">${hist.length} sesiones</p></header>
    <div class="stats3">${tiles.map(([l, v]) => `<div><b>${v}</b><span>${l}</span></div>`).join("")}</div>
    <div class="card">${chart(hist.map((h) => ({ t: h.session.start, v: h.m[field] })), unit)}</div>
    ${[...hist].reverse().map((h) => `<div class="card">
      <div class="row"><strong>${fmtDate(h.session.start)}</strong><span class="muted small">${esc(h.session.title)}</span></div>
      <span class="muted small">${h.ex.sets.map((x) => esc(fmtSet(type, x))).join(" · ")}</span>
    </div>`).join("")}`;
}

function chart(pts, unit) {
  if (pts.length < 2) return `<p class="muted small">Con 2 sesiones o más verás aquí la gráfica de progreso.</p>`;
  const W = 320, H = 160, P = 28;
  let min = Math.min(...pts.map((p) => p.v)), max = Math.max(...pts.map((p) => p.v));
  if (min === max) { min -= 1; max += 1; }
  const X = (i) => P + (i * (W - 2 * P)) / (pts.length - 1);
  const Y = (v) => H - P - ((v - min) / (max - min)) * (H - 2 * P);
  const line = pts.map((p, i) => `${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(" ");
  const d = (t) => new Date(t).toLocaleDateString("es", { day: "numeric", month: "short" });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica de progreso">
    <line class="grid-l" x1="${P}" y1="${Y(max)}" x2="${W - P}" y2="${Y(max)}"/>
    <line class="grid-l" x1="${P}" y1="${Y(min)}" x2="${W - P}" y2="${Y(min)}"/>
    <text x="${P}" y="${Y(max) - 6}">${kg(max)}</text><text x="${P}" y="${Y(min) + 14}">${kg(min)}</text>
    <polyline points="${line}"/>
    ${pts.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="3.5"/>`).join("")}
    <text x="${P}" y="${H - 6}">${d(pts[0].t)}</text><text x="${W - P}" y="${H - 6}" text-anchor="end">${d(pts.at(-1).t)}</text>
  </svg><p class="muted small center">${unit}</p>`;
}

function guiaView() {
  const id = route().param;
  if (id) return guiaDetalle(id);
  return `<header class="top"><h1>Guía de ejercicios</h1><p class="muted">${GUIA.length} ejercicios con explicación y foto</p></header>
    <input class="search" type="search" placeholder="Buscar ejercicio o músculo…" data-field="guia-q" aria-label="Buscar ejercicio">
    ${CATEGORIAS.map((cat) => `<section class="guia-cat"><h2>${cat}</h2>
      ${GUIA.filter((g) => g.cat === cat).map((g) => `<a class="card guia-item" href="#/guia/${g.id}" data-buscar="${esc((g.nombre + " " + g.musculos).toLowerCase())}">
        ${g.foto ? `<img src="${g.foto.src}" alt="" loading="lazy">` : `<span class="noimg">▶</span>`}
        <span><strong>${esc(g.nombre)}</strong><span class="muted small">${esc(g.musculos)}</span></span>
      </a>`).join("")}</section>`).join("")}`;
}

function guiaDetalle(id) {
  const g = guiaPorId(id);
  if (!g) return notFound();
  const enRutina = state.routine.days.filter((d) => d.exercises.some((e) => e.guia?.includes(id)));
  const video = `https://www.youtube.com/results?search_query=${encodeURIComponent(g.video || g.nombre + " técnica")}`;
  const lista = (titulo, items, cls) => items?.length ? `<h2>${titulo}</h2><ul class="${cls}">${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
  return `<header class="top"><a href="#/guia" class="back" data-action="back">‹ Volver</a><h1>${esc(g.nombre)}</h1><p class="muted">${esc(g.musculos)}</p></header>
    ${g.foto ? `<figure class="guia-foto"><img src="${g.foto.src}" alt="${esc(g.nombre)}">
        <figcaption>Foto: ${esc(g.foto.autor)} · ${esc(g.foto.licencia)} · <a href="${g.foto.fuente}" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption></figure>`
      : `<p class="muted small">No hay una foto con licencia libre para este ejercicio; mira un video de referencia.</p>`}
    <a class="btn block" href="${video}" target="_blank" rel="noopener">▶ Buscar video en YouTube</a>
    <h2>Cómo se hace</h2><ol class="pasos">${g.pasos.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
    ${lista("Consejos", g.consejos, "consejos")}
    ${lista("Errores comunes", g.errores, "errores")}
    ${enRutina.length ? `<h2>En tu rutina</h2>${enRutina.map((d) => `<a class="chip" href="#/dia/${encodeURIComponent(d.id)}">${esc(d.title)}</a>`).join(" ")}` : ""}`;
}

function settings() {
  return `<header class="top"><h1>Ajustes</h1></header>
    <label class="field">Nombre de la rutina<input data-field="routine" data-k="name" value="${esc(state.routine.name)}"></label>
    <label class="field">Semana actual del programa (cambia sola cada lunes)<select data-field="week">
      ${Array.from({ length: WEEKS }, (_, i) => `<option value="${i + 1}" ${programWeek() === i + 1 ? "selected" : ""}>Semana ${i + 1}</option>`).join("")}
    </select></label>
    <div class="card">
      <strong>Copia de seguridad</strong>
      <span class="muted small">Tus datos solo viven en este dispositivo. Exporta una copia de vez en cuando.</span>
      <div class="row gap"><button class="btn" data-action="export">Exportar</button><button class="btn" data-action="import">Importar</button></div>
      <input type="file" id="import-file" accept="application/json,.json" hidden>
    </div>
    <div class="card">
      <strong>Rutina incluida</strong>
      <span class="muted small">Vuelve a cargar la rutina original de la app. Tu historial no se borra.</span>
      <button class="btn" data-action="routine-reset">Restaurar rutina</button>
    </div>
    <div class="card">
      <strong>Borrar todo</strong>
      <span class="muted small">Elimina rutina, historial y entreno en curso de este dispositivo.</span>
      <button class="btn danger" data-action="wipe">Borrar todos los datos</button>
    </div>
    <p class="muted small center" id="storage-info"></p>`;
}

const notFound = () => `<header class="top"><h1>No encontrado</h1></header><a class="btn block" href="#/">Volver a Hoy</a>`;

// ---------- entreno ----------
function activeExercise(base) {
  const e = resolve(base); // aplica objetivos de la semana actual
  const k = S.key(e.name), prev = S.lastFor(state.sessions, k), reps = S.parseReps(e.reps);
  const type = e.type || "weight_reps";
  const weekly = !!e.weekly; // con objetivo semanal manda el objetivo, no lo de la vez anterior
  return {
    key: k, name: e.name, type, rest: e.rest ?? 90, target: target(base), notes: e.notes || "", guia: e.guia || [],
    goal: e.weekly?.goal ? reps : null,
    prev: prev ? prev.sets : [],
    // Cada serie se pre-rellena con lo que hiciste la última vez (o con el objetivo de la rutina).
    sets: Array.from({ length: Math.max(1, e.sets || 1) }, (_, i) => {
      const p = weekly ? null : prev?.sets[i];
      return { kind: e.warmup || p?.kind === "warmup" ? "warmup" : "normal", weight: p?.weight ?? e.weight ?? null,
        reps: p?.reps ?? reps, seconds: p?.seconds ?? e.seconds ?? null, done: false };
    }),
  };
}

function startWorkout(dayId) {
  if (state.active) { location.hash = "#/entreno"; return; }
  const d = state.routine.days.find((x) => x.id === dayId);
  if (!d) return;
  state.active = { id: uid(), dayId: d.id, title: d.title, start: Date.now(), exercises: d.exercises.map(activeExercise) };
  save();
  location.hash = "#/entreno";
}

function finishWorkout() {
  const a = state.active;
  const all = a.exercises.flatMap((e) => e.sets), done = all.filter((s) => s.done).length;
  if (!done) {
    if (confirm("No marcaste ninguna serie. ¿Descartar el entreno?")) endWorkout();
    return;
  }
  if (done < all.length && !confirm(`Hay ${all.length - done} series sin marcar y no se guardarán. ¿Terminar el entreno?`)) return;
  const session = {
    id: a.id, dayId: a.dayId, title: a.title, start: a.start, end: Date.now(),
    exercises: a.exercises
      .map((e) => ({ key: e.key, name: e.name, type: e.type,
        sets: e.sets.filter((s) => s.done).map(({ kind, weight, reps, seconds }) => ({ kind, weight, reps, seconds })) }))
      .filter((e) => e.sets.length),
  };
  state.sessions.push(session);
  endWorkout("#/sesion/" + session.id);
}

function endWorkout(to = "#/") {
  state.active = null;
  save();
  T.stop();
  wakeLock?.release?.(); wakeLock = null;
  location.hash = to;
}

async function keepAwake() {
  // Evita que la pantalla se apague durante el entreno (si el navegador lo permite).
  try { if (!wakeLock && "wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen"); } catch { /* no soportado */ }
}

// ---------- acciones (botones con data-action) ----------
const actions = {
  start: (el) => startWorkout(el.dataset.day),
  // "Volver" desde la guía: regresa a donde estabas (rutina o entreno); si no hay historial, a la lista.
  back: () => { if (prevHash !== null) history.back(); else location.hash = "#/guia"; },
  "edit-on": () => { editMode = true; render(); },
  "edit-off": () => { editMode = false; render(); },
  "day-add": () => {
    const d = { id: uid(), title: "Nuevo día", weekday: null, exercises: [] };
    state.routine.days.push(d); markEdited(); editNext = true; location.hash = "#/dia/" + d.id;
  },
  "day-del": () => {
    if (!confirm("¿Eliminar este día de la rutina? El historial no se borra.")) return;
    state.routine.days = state.routine.days.filter((d) => d !== currentDay());
    markEdited(); editMode = false; location.hash = "#/";
  },
  "ex-add": () => {
    currentDay().exercises.push({ id: uid(), name: "Nuevo ejercicio", type: "weight_reps", sets: 3, reps: "8-10", weight: null, rest: 90, notes: "" });
    markEdited(); render();
  },
  "ex-del": (el) => {
    if (!confirm("¿Quitar este ejercicio del día?")) return;
    currentDay().exercises.splice(+el.dataset.i, 1); markEdited(); render();
  },
  "ex-move": (el) => {
    const list = currentDay().exercises, i = +el.dataset.i, j = i + +el.dataset.d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]]; markEdited(); render();
  },
  "set-done": (el) => {
    const ex = state.active.exercises[+el.dataset.ei], s = ex.sets[+el.dataset.si];
    s.done = !s.done;
    if (s.done && s.kind !== "dropset") T.startRest(ex.rest);
    save(); render();
  },
  "set-kind": (el) => {
    const s = state.active.exercises[+el.dataset.ei].sets[+el.dataset.si];
    s.kind = KINDS[(KINDS.indexOf(s.kind) + 1) % KINDS.length]; save(); render();
  },
  "set-add": (el) => {
    const ex = state.active.exercises[+el.dataset.ei], last = ex.sets.at(-1);
    ex.sets.push({ kind: "normal", weight: last?.weight ?? null, reps: last?.reps ?? null, seconds: last?.seconds ?? null, done: false });
    save(); render();
  },
  "set-del": (el) => {
    const ex = state.active.exercises[+el.dataset.ei];
    if (ex.sets.length > 1) { ex.sets.pop(); save(); render(); }
  },
  "wex-add": () => {
    const name = prompt("Nombre del ejercicio");
    if (!name?.trim()) return;
    const type = confirm("¿Lleva peso? (Aceptar = peso y reps · Cancelar = solo reps)") ? "weight_reps" : "reps_only";
    state.active.exercises.push(activeExercise({ name: name.trim(), type, sets: 3, reps: "", rest: 90 }));
    save(); render();
  },
  finish: finishWorkout,
  cancel: () => { if (confirm("¿Descartar este entreno? No se guardará nada.")) endWorkout(); },
  "session-del": () => {
    if (!confirm("¿Eliminar este entreno del historial?")) return;
    state.sessions = state.sessions.filter((s) => s.id !== route().param); save(); location.hash = "#/historial";
  },
  export: () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `entreno-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  import: () => document.getElementById("import-file").click(),
  "routine-reset": () => { if (confirm("¿Restaurar la rutina incluida? Perderás los cambios que hiciste a la rutina.")) { resetRoutine(); render(); } },
  wipe: () => { if (confirm("¿Borrar TODOS los datos de este dispositivo? No se puede deshacer.")) { wipe(); T.stop(); location.hash = "#/"; render(); } },
};

// ---------- campos editables (data-field) ----------
function onField(el, isChange) {
  const { field, k } = el.dataset, v = el.value;
  if (field === "set") {
    state.active.exercises[+el.dataset.ei].sets[+el.dataset.si][k] = num(v);
    save();
  } else if (field === "guia-q") {
    const q = v.trim().toLowerCase();
    document.querySelectorAll(".guia-item").forEach((a) => { a.hidden = q && !a.dataset.buscar.includes(q); });
    document.querySelectorAll(".guia-cat").forEach((s) => { s.hidden = !s.querySelector(".guia-item:not([hidden])"); });
  } else if (field === "week") {
    // Fija el inicio del programa para que la semana actual sea la elegida.
    state.programStart = mondayOf(Date.now()) - (+v - 1) * 7 * DAY_MS;
    save();
  } else if (field === "routine") {
    state.routine[k] = v; markEdited();
  } else if (field === "day") {
    const d = currentDay();
    d[k] = k === "weekday" ? (v === "" ? null : +v) : v;
    markEdited();
  } else if (field === "rx") {
    const e = currentDay().exercises[+el.dataset.i];
    e[k] = ["sets", "weight", "rest", "seconds"].includes(k) ? num(v) : v;
    markEdited();
    if (isChange && k === "type") render(); // cambian los campos visibles
  }
}

// ---------- render y arranque ----------
function render() {
  clearInterval(ticker); ticker = null;
  const { view } = route();
  const views = { "": home, dia: day, entreno: workout, historial: historyView, sesion: sessionView, progreso: progress, ejercicio: exerciseView, guia: guiaView, ajustes: settings };
  app.innerHTML = (views[view] || home)();
  document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("on", a.dataset.nav === (NAV_OF[view] ?? "")));
  if (view === "entreno" && state.active) {
    keepAwake();
    ticker = setInterval(() => {
      const el = document.getElementById("elapsed");
      if (el) el.textContent = clock((Date.now() - state.active.start) / 1000);
    }, 1000);
  }
  if (view === "ajustes") storageInfo();
}

async function storageInfo() {
  const el = document.getElementById("storage-info");
  const persisted = await navigator.storage?.persisted?.();
  if (el) el.textContent = `${state.sessions.length} entrenos guardados · almacenamiento ${persisted ? "persistente" : "normal"}`;
}

app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (el && actions[el.dataset.action]) { e.preventDefault(); actions[el.dataset.action](el); }
});
app.addEventListener("input", (e) => { if (e.target.dataset.field) onField(e.target, false); });
app.addEventListener("change", async (e) => {
  if (e.target.dataset.field) onField(e.target, true);
  if (e.target.id === "import-file" && e.target.files[0]) {
    try {
      const obj = JSON.parse(await e.target.files[0].text());
      if (confirm(`Importar copia con ${obj.sessions?.length ?? 0} entrenos. Reemplazará los datos actuales. ¿Continuar?`)) {
        importBackup(obj); alert("Copia importada."); render();
      }
    } catch (err) { alert("No se pudo importar: " + err.message); }
  }
});
// Al tocar un campo numérico, selecciona su contenido para escribir encima directamente.
app.addEventListener("focusin", (e) => { if (e.target.classList?.contains("num")) e.target.select(); });

// Recuerda el scroll de cada pantalla: al volver de la guía al entreno, quedas donde estabas.
const scrollPos = {};
let curHash = location.hash, prevHash = null;
window.addEventListener("scroll", () => { scrollPos[curHash] = window.scrollY; }, { passive: true });
window.addEventListener("hashchange", () => {
  editMode = editNext; editNext = false;
  prevHash = curHash; curHash = location.hash;
  render();
  window.scrollTo(0, scrollPos[curHash] ?? 0);
});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && route().view === "entreno") { wakeLock = null; keepAwake(); } });

if (!state.programStart) { state.programStart = mondayOf(Date.now()); save(); } // semana 1 = esta semana
T.initTimer();
navigator.storage?.persist?.(); // pide al navegador que no borre los datos
render();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
