"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SkipForward,
  Star,
  X,
} from "lucide-react";
import { CircularTimer } from "@/components/cocina/circular-timer";
import { useCookTimer } from "@/hooks/use-cook-timer";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { alertTimerDone, ensureNotificationPermission } from "@/lib/cook-alerts";
import type { Receta } from "@/types/receta";

interface CookModeProps {
  receta: Receta;
}

export function CookMode({ receta }: CookModeProps) {
  const router = useRouter();
  const pasos = receta.pasos;
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  const paso = pasos[stepIndex];
  const totalSteps = pasos.length;
  const progressPct = finished ? 100 : ((stepIndex + 1) / totalSteps) * 100;

  useWakeLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push(`/recetas/${receta.id}`);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (stepIndex < totalSteps - 1) setStepIndex((i) => i + 1);
        else setFinished(true);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (finished) {
          setFinished(false);
          setStepIndex(totalSteps - 1);
        } else if (stepIndex > 0) setStepIndex((i) => i - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, receta.id, stepIndex, totalSteps, finished]);

  const onTimerDone = useCallback(() => {
    if (!paso) return;
    setTimerAlert(true);
    void alertTimerDone(paso.titulo);
  }, [paso]);

  const timer = useCookTimer({ onDone: onTimerDone });

  useEffect(() => {
    document.documentElement.setAttribute("data-cook-mode", "true");
    return () => {
      document.documentElement.removeAttribute("data-cook-mode");
      timer.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar/desmontar
  }, []);

  // Al cambiar de paso, resetear temporizador
  useEffect(() => {
    timer.reset();
    setTimerAlert(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const goPrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const goNext = () => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setFinished(true);
      timer.reset();
    }
  };

  const startTimer = async () => {
    if (!paso?.tiempoSegundos) return;
    await ensureNotificationPermission();
    setTimerAlert(false);
    timer.start(paso.tiempoSegundos);
  };

  const submitRating = (value: number) => {
    setRating(value);
    setRated(true);
    try {
      const key = "recetas-andaluzas-ratings";
      const prev = JSON.parse(localStorage.getItem(key) ?? "{}") as Record<string, number>;
      prev[receta.id] = value;
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {
      /* ignore */
    }
  };

  if (finished) {
    return (
      <div className="cook-shell flex min-h-dvh flex-col bg-background">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex size-20 items-center justify-center rounded-full bg-aceituna/15 text-aceituna"
          >
            <Check className="size-10" strokeWidth={2.5} />
          </motion.div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            ¡Receta completada!
          </h1>
          <p className="mt-3 max-w-md text-lg text-muted-foreground">
            {receta.nombre} listo. Buen provecho.
          </p>

          <div className="mt-10">
            <p className="text-sm font-semibold text-muted-foreground">¿Cómo te salió?</p>
            <div className="mt-3 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => submitRating(n)}
                  className="rounded-md p-2 transition-transform hover:scale-110"
                  aria-label={`${n} estrellas`}
                >
                  <Star
                    className={`size-9 ${
                      n <= rating ? "fill-aceite text-aceite" : "text-border-strong"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rated && (
              <p className="mt-3 text-sm text-aceituna">Gracias por tu valoración</p>
            )}
          </div>

          <div className="mt-12 flex w-full max-w-sm flex-col gap-3">
            <Link href={`/recetas/${receta.id}`} className="btn btn-primary min-h-14 text-base">
              Volver a la ficha
            </Link>
            <button
              type="button"
              className="btn btn-secondary min-h-14 text-base"
              onClick={() => {
                setFinished(false);
                setStepIndex(0);
                setRating(0);
                setRated(false);
              }}
            >
              Cocinar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paso) return null;

  const showTimer = Boolean(paso.tiempoSegundos);
  const timerActive = timer.status === "running" || timer.status === "paused";

  return (
    <div className="cook-shell flex min-h-dvh flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link
          href={`/recetas/${receta.id}`}
          className="btn btn-ghost size-12 min-h-0 p-0"
          aria-label="Salir del modo cocina"
        >
          <X className="size-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{receta.nombre}</p>
          <p className="text-xs text-muted-foreground">
            Paso {stepIndex + 1} de {totalSteps}
          </p>
        </div>
      </header>

      {/* Progress */}
      <div
        className="h-1.5 w-full bg-surface-muted"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={stepIndex + 1}
        aria-label={`Paso ${stepIndex + 1} de ${totalSteps}`}
      >
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col px-5 py-6 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={paso.numero}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-1 flex-col"
          >
            <p className="text-sm font-bold tracking-[0.14em] text-aceituna uppercase">
              Paso {paso.numero}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
              {paso.titulo}
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-foreground/90 sm:text-2xl">
              {paso.descripcion}
            </p>
            {paso.consejo && (
              <p className="mt-4 max-w-2xl rounded-md border border-aceituna/30 bg-aceituna/10 px-4 py-3 text-base text-aceituna sm:text-lg">
                Consejo: {paso.consejo}
              </p>
            )}

            {showTimer && (
              <div className="mt-8 flex flex-1 flex-col items-center justify-center">
                {timerAlert && (
                  <div
                    className="mb-4 w-full max-w-sm animate-pulse rounded-md bg-accent px-4 py-3 text-center text-base font-semibold text-accent-foreground"
                    role="alert"
                  >
                    ¡Tiempo terminado!
                  </div>
                )}

                {(timerActive || timer.status === "done") && (
                  <CircularTimer
                    remaining={timer.status === "done" ? 0 : timer.remaining}
                    total={timer.total || paso.tiempoSegundos!}
                  />
                )}

                {timer.status === "idle" && (
                  <div className="text-center">
                    <p className="font-display text-5xl font-semibold tabular-nums text-primary sm:text-6xl">
                      {Math.round(paso.tiempoSegundos! / 60)}
                      <span className="text-2xl text-muted-foreground"> min</span>
                    </p>
                    <p className="mt-2 text-muted-foreground">Temporizador de este paso</p>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {timer.status === "idle" && (
                    <button
                      type="button"
                      onClick={() => void startTimer()}
                      className="btn btn-primary min-h-14 min-w-[10rem] text-base"
                    >
                      <Play className="size-5" />
                      Iniciar
                    </button>
                  )}
                  {timer.status === "running" && (
                    <button
                      type="button"
                      onClick={timer.pause}
                      className="btn btn-secondary min-h-14 min-w-[10rem] text-base"
                    >
                      <Pause className="size-5" />
                      Pausar
                    </button>
                  )}
                  {timer.status === "paused" && (
                    <button
                      type="button"
                      onClick={timer.resume}
                      className="btn btn-primary min-h-14 min-w-[10rem] text-base"
                    >
                      <Play className="size-5" />
                      Reanudar
                    </button>
                  )}
                  {(timer.status === "running" || timer.status === "paused") && (
                    <button
                      type="button"
                      onClick={timer.skip}
                      className="btn btn-ghost min-h-14 text-base"
                    >
                      <SkipForward className="size-5" />
                      Saltar
                    </button>
                  )}
                  {timer.status === "done" && (
                    <button
                      type="button"
                      onClick={() => {
                        setTimerAlert(false);
                        timer.reset();
                      }}
                      className="btn btn-secondary min-h-14 text-base"
                    >
                      Reiniciar timer
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav — botones grandes para manos ocupadas */}
      <nav className="safe-bottom grid grid-cols-2 gap-3 border-t border-border bg-surface p-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="btn btn-secondary min-h-16 text-base disabled:opacity-40"
        >
          <ChevronLeft className="size-6" />
          Anterior
        </button>
        <button
          type="button"
          onClick={goNext}
          className="btn btn-primary min-h-16 text-base"
        >
          {stepIndex === totalSteps - 1 ? "Terminar" : "Siguiente"}
          {stepIndex < totalSteps - 1 && <ChevronRight className="size-6" />}
        </button>
      </nav>
    </div>
  );
}
