"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TimerStatus = "idle" | "running" | "paused" | "done";

interface UseCookTimerOptions {
  onDone?: () => void;
}

export function useCookTimer({ onDone }: UseCookTimerOptions = {}) {
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const workerRef = useRef<Worker | null>(null);
  const endsAtRef = useRef<number | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const worker = new Worker("/workers/cook-timer.js");
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<{ type: string; remaining?: number }>) => {
      if (event.data.type === "tick" && event.data.remaining != null) {
        setRemaining(event.data.remaining);
      }
      if (event.data.type === "done") {
        setRemaining(0);
        setStatus("done");
        endsAtRef.current = null;
        onDoneRef.current?.();
      }
    };

    return () => {
      worker.postMessage({ type: "stop" });
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Recalcular al volver a primer plano (móvil bloqueado / pestaña en background)
  useEffect(() => {
    const sync = () => {
      if (status !== "running" || endsAtRef.current == null) return;
      const left = Math.max(0, Math.ceil((endsAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        setStatus("done");
        endsAtRef.current = null;
        workerRef.current?.postMessage({ type: "stop" });
        onDoneRef.current?.();
      }
    };
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
    };
  }, [status]);

  const start = useCallback((seconds: number) => {
    const s = Math.max(1, Math.round(seconds));
    setTotal(s);
    setRemaining(s);
    setStatus("running");
    const endsAt = Date.now() + s * 1000;
    endsAtRef.current = endsAt;
    workerRef.current?.postMessage({ type: "start", endsAt });
  }, []);

  const pause = useCallback(() => {
    if (status !== "running") return;
    workerRef.current?.postMessage({ type: "pause" });
    endsAtRef.current = null;
    setStatus("paused");
  }, [status]);

  const resume = useCallback(() => {
    if (status !== "paused" || remaining <= 0) return;
    const endsAt = Date.now() + remaining * 1000;
    endsAtRef.current = endsAt;
    setStatus("running");
    workerRef.current?.postMessage({ type: "resume", endsAt });
  }, [status, remaining]);

  const skip = useCallback(() => {
    workerRef.current?.postMessage({ type: "stop" });
    endsAtRef.current = null;
    setRemaining(0);
    setTotal(0);
    setStatus("idle");
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({ type: "stop" });
    endsAtRef.current = null;
    setRemaining(0);
    setTotal(0);
    setStatus("idle");
  }, []);

  const progress = total > 0 ? 1 - remaining / total : 0;

  return {
    remaining,
    total,
    status,
    progress,
    start,
    pause,
    resume,
    skip,
    reset,
  };
}
