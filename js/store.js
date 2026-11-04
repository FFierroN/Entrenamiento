// Almacenamiento: todo el estado vive en localStorage de este dispositivo.
import { RUTINA_INICIAL } from "./rutina.js";

const KEY = "entreno:v1";
const clone = (o) => JSON.parse(JSON.stringify(o));

const fresh = () => ({
  version: 1,
  routine: clone(RUTINA_INICIAL),
  routineSeed: RUTINA_INICIAL.version,
  routineEdited: false, // true cuando editas la rutina desde la app
  sessions: [],         // entrenos terminados
  active: null,         // entreno en curso (se guarda en cada cambio)
});

function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch { /* datos corruptos o sin acceso */ }
  if (!s || !s.routine) s = fresh();
  // Si la rutina incluida cambió y no la editaste, se actualiza sola (el historial se mantiene).
  if (!s.routineEdited && s.routineSeed !== RUTINA_INICIAL.version) {
    s.routine = clone(RUTINA_INICIAL);
    s.routineSeed = RUTINA_INICIAL.version;
  }
  return s;
}

export const state = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { alert("No se pudo guardar: " + e.message); }
}

export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2);

function replaceState(obj) {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, obj);
  save();
}

export function resetRoutine() {
  state.routine = clone(RUTINA_INICIAL);
  state.routineSeed = RUTINA_INICIAL.version;
  state.routineEdited = false;
  save();
}

export function importBackup(obj) {
  if (!obj || !obj.routine || !Array.isArray(obj.sessions)) throw new Error("El archivo no es una copia de seguridad válida.");
  replaceState({ ...fresh(), ...obj });
}

export const wipe = () => replaceState(fresh());
