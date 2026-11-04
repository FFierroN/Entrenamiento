// Temporizador de descanso: barra fija abajo, vibra y suena al terminar.
let endAt = 0, total = 0, iv = null, audio = null;

const el = () => document.getElementById("timer");
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function startRest(seconds) {
  if (!seconds) return;
  // El audio solo se puede activar tras un toque del usuario: lo preparamos aquí.
  try { audio ??= new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch { /* sin audio */ }
  total = seconds;
  endAt = Date.now() + seconds * 1000;
  el().hidden = false;
  clearInterval(iv);
  iv = setInterval(tick, 250);
  tick();
}

export function stop() {
  endAt = 0;
  clearInterval(iv);
  iv = null;
  el().hidden = true;
}

function adjust(delta) {
  endAt += delta * 1000;
  total = Math.max(total, (endAt - Date.now()) / 1000);
  tick();
}

function tick() {
  const left = Math.ceil((endAt - Date.now()) / 1000);
  if (left <= 0) { alarm(); stop(); return; }
  el().querySelector(".t-time").textContent = fmt(left);
  el().querySelector(".t-bar").style.width = `${(left / total) * 100}%`;
}

function alarm() {
  navigator.vibrate?.([300, 150, 300]);
  if (!audio) return;
  for (const [t, f] of [[0, 880], [0.25, 880], [0.5, 1320]]) {
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = f;
    g.gain.setValueAtTime(0.3, audio.currentTime + t);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + t + 0.2);
    o.connect(g).connect(audio.destination);
    o.start(audio.currentTime + t);
    o.stop(audio.currentTime + t + 0.2);
  }
}

export function initTimer() {
  el().addEventListener("click", (e) => {
    const b = e.target.closest("[data-timer]");
    if (!b) return;
    if (b.dataset.timer === "skip") stop(); else adjust(Number(b.dataset.timer));
  });
}
