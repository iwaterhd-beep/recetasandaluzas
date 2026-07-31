"use client";

/** Beep + vibración + notificación al terminar el temporizador */
export async function alertTimerDone(stepTitle: string) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([220, 120, 220, 120, 400]);
    }
  } catch {
    /* ignore */
  }

  try {
    const ctx = new AudioContext();
    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.02);
    };
    playTone(880, 0, 0.18);
    playTone(1175, 0.2, 0.22);
    playTone(1319, 0.45, 0.35);
    setTimeout(() => void ctx.close(), 1200);
  } catch {
    /* autoplay / AudioContext bloqueado */
  }

  try {
    if (typeof Notification !== "undefined") {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        new Notification("¡Tiempo terminado!", {
          body: stepTitle,
          tag: "recetas-cook-timer",
          lang: "es",
        });
      }
    }
  } catch {
    /* ignore */
  }
}

export async function ensureNotificationPermission() {
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  } catch {
    /* ignore */
  }
}
