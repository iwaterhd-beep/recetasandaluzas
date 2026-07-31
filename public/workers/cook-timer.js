/* Temporizador en Web Worker — sigue midiendo con timestamp absoluto */
let intervalId = null;
let endsAt = null;

function clear() {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function tick() {
  if (endsAt == null) return;
  const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
  self.postMessage({ type: "tick", remaining });
  if (remaining <= 0) {
    clear();
    endsAt = null;
    self.postMessage({ type: "done" });
  }
}

self.onmessage = (event) => {
  const data = event.data;
  if (data.type === "start") {
    endsAt = data.endsAt;
    clear();
    tick();
    intervalId = setInterval(tick, 250);
  } else if (data.type === "pause" || data.type === "stop") {
    clear();
    if (data.type === "stop") endsAt = null;
  } else if (data.type === "resume") {
    endsAt = data.endsAt;
    clear();
    tick();
    intervalId = setInterval(tick, 250);
  }
};
