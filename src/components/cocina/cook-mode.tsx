"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ListChecks,
  Pause,
  Play,
  SkipForward,
  Timer,
  X,
} from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { AmazonAffiliate } from "@/components/ads/amazon-affiliate";
import { CircularTimer } from "@/components/cocina/circular-timer";
import { CookFeedback } from "@/components/cocina/cook-feedback";
import { StepScene } from "@/components/cocina/step-scene";
import { createClient } from "@/lib/supabase/client";
import { useCookTimer } from "@/hooks/use-cook-timer";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { alertTimerDone, ensureNotificationPermission } from "@/lib/cook-alerts";
import { getCookStepSideInfo } from "@/lib/cook-step-info";
import type { Receta } from "@/types/receta";

interface CookModeProps {
  receta: Receta;
}

function formatMin(seconds: number): string {
  const m = Math.round(seconds / 60);
  return m < 1 ? `${seconds} s` : `${m} min`;
}

export function CookMode({ receta }: CookModeProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const pasos = receta.pasos;
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [stepDone, setStepDone] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const paso = pasos[stepIndex];
  const totalSteps = pasos.length;
  const progressPct = finished ? 100 : ((stepIndex + 1) / totalSteps) * 100;
  const sideInfo = useMemo(
    () => (paso ? getCookStepSideInfo(receta, stepIndex) : null),
    [paso, receta, stepIndex],
  );

  const checkedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked],
  );

  useWakeLock(true);

  useEffect(() => {
    const supabase = createClient();
    void supabase?.rpc("track_recipe_event", {
      p_recipe_id: receta.id,
      p_event_type: "cook_start",
    });
  }, [receta.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showIngredients) {
          setShowIngredients(false);
          return;
        }
        router.push(`/recetas/${receta.id}`);
        return;
      }
      if (e.key === "i" || e.key === "I") {
        setShowIngredients((v) => !v);
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
  }, [router, receta.id, stepIndex, totalSteps, finished, showIngredients]);

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

  const toggleStepItem = (key: string) => {
    setStepDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 56) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  if (finished) {
    return (
      <div className="cook-shell cook-shell--done">
        <div className="cook-done">
          <motion.div
            initial={reduce ? false : { scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="cook-done__badge"
          >
            <Check className="size-10" strokeWidth={2.5} />
          </motion.div>
          <p className="cook-done__eyebrow">Modo cocina</p>
          <h1 className="cook-done__title">¡Listo para la mesa!</h1>
          <p className="cook-done__lead">
            <strong>{receta.nombre}</strong> completado. Buen provecho.
          </p>

          <div className="cook-done__rating">
            <CookFeedback recipeId={receta.id} />
          </div>

          <div className="cook-done__ads">
            <AdSlot position="cook-banner" cookContext />
            <AmazonAffiliate categoria={receta.categoria} limit={2} />
          </div>

          <div className="cook-done__actions">
            <Link href={`/recetas/${receta.id}`} className="btn btn-primary min-h-14 text-base">
              Volver a la ficha
            </Link>
            <button
              type="button"
              className="btn btn-secondary min-h-14 text-base"
              onClick={() => {
                setFinished(false);
                setStepIndex(0);
                setChecked({});
                setStepDone({});
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
  const rawChecklist = sideInfo?.checklist ?? [];
  // Evita repetir «Sala.» / «Sala» en pasos ya atómicos
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[.;]+$/g, "")
      .trim();
  const checklist =
    rawChecklist.length === 1 &&
    (norm(rawChecklist[0]!) === norm(paso.descripcion) ||
      norm(rawChecklist[0]!) === norm(paso.titulo))
      ? []
      : rawChecklist;
  // Solo oculta la descripción si es el mismo verbo que el título («Salar» / «Sala.»)
  const descIsRedundant = norm(paso.descripcion) === norm(paso.titulo);

  return (
    <div className="cook-shell">
      <header className="cook-top">
        <Link
          href={`/recetas/${receta.id}`}
          className="cook-top__icon"
          aria-label="Salir del modo cocina"
        >
          <X className="size-6" strokeWidth={2} />
        </Link>
        <div className="cook-top__meta">
          <p className="cook-top__name">{receta.nombre}</p>
        </div>
        <p className="cook-top__counter" aria-live="polite">
          Paso {stepIndex + 1}
          <span> / {totalSteps}</span>
        </p>
        <button
          type="button"
          className="cook-top__icon"
          onClick={() => setShowIngredients(true)}
          aria-label="Ver ingredientes"
          title="Ingredientes (I)"
        >
          <ListChecks className="size-5" />
          {checkedCount > 0 && (
            <span className="cook-top__badge">{checkedCount}</span>
          )}
        </button>
      </header>

      <div
        className="cook-progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={stepIndex + 1}
        aria-label={`Paso ${stepIndex + 1} de ${totalSteps}`}
      >
        <div className="cook-progress__segments" aria-hidden>
          {pasos.map((p, i) => (
            <button
              key={p.numero}
              type="button"
              className={`cook-progress__seg ${
                i < stepIndex ? "is-done" : i === stepIndex ? "is-current" : ""
              }`}
              onClick={() => setStepIndex(i)}
              aria-label={`Ir al paso ${i + 1}`}
              title={p.titulo}
            />
          ))}
        </div>
        <div className="cook-progress__bar" style={{ width: `${progressPct}%` }} />
      </div>

      <div
        className="cook-body"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Panel visual — estilo ventana del robot */}
        <section className="cook-stage" aria-label="Animación del paso">
          <AnimatePresence mode="wait">
            <motion.div
              key={`stage-${paso.numero}-${timer.status}`}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="cook-stage__inner"
            >
              {(!showTimer || timer.status === "idle") && (
                <StepScene
                  key={`scene-${paso.numero}`}
                  titulo={paso.titulo}
                  descripcion={paso.descripcion}
                  hideTip
                  liquid={sideInfo?.liquid ?? null}
                />
              )}
              {showTimer && (
                <CookTimerPanel
                  pasoSeconds={paso.tiempoSegundos!}
                  timer={timer}
                  timerAlert={timerAlert}
                  onStart={() => void startTimer()}
                  onClearAlert={() => setTimerAlert(false)}
                  compact={timer.status === "idle"}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Instrucciones — tipografía grande, una acción */}
        <div className="cook-main">
          <AnimatePresence mode="wait">
            <motion.article
              key={paso.numero}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="cook-step"
            >
              <p className="cook-step__index">
                <span className="cook-step__num">
                  {String(stepIndex + 1).padStart(2, "0")}
                </span>
                {showTimer && (
                  <span className="cook-step__time-chip">
                    <Timer className="size-3.5" aria-hidden />
                    {formatMin(paso.tiempoSegundos!)}
                  </span>
                )}
              </p>

              <h1 className="cook-step__title">{paso.titulo}</h1>
              {!descIsRedundant && (
                <p className="cook-step__desc">{paso.descripcion}</p>
              )}

              {checklist.length > 0 && (
                <ul className="cook-checks">
                  {checklist.map((item, i) => {
                    const key = `${paso.numero}-${i}`;
                    const on = Boolean(stepDone[key]);
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          className={`cook-check ${on ? "is-on" : ""}`}
                          onClick={() => toggleStepItem(key)}
                          aria-pressed={on}
                        >
                          <span className="cook-check__box" aria-hidden>
                            {on ? <Check className="size-3.5" strokeWidth={3} /> : null}
                          </span>
                          <span className="cook-check__text">{item}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {sideInfo && sideInfo.ingredientes.length > 0 && (
                <div className="cook-ings">
                  <p className="cook-ings__label">Para este paso</p>
                  <ul className="cook-ings__list">
                    {sideInfo.ingredientes.map((ing) => (
                      <li key={ing.id}>
                        <strong>
                          {ing.cantidadBase} {ing.unidad}
                        </strong>
                        {ing.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sideInfo?.tip && (
                <aside className="cook-tip">
                  <Lightbulb className="cook-tip__icon size-4 shrink-0" aria-hidden />
                  <p className="cook-tip__text">{sideInfo.tip}</p>
                </aside>
              )}

              {sideInfo?.nextTitulo && (
                <p className="cook-after">
                  Después <span>{sideInfo.nextTitulo}</span>
                </p>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      <nav className="cook-nav safe-bottom">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="cook-nav__btn cook-nav__btn--ghost"
        >
          <ChevronLeft className="size-5" />
          Anterior
        </button>
        <button
          type="button"
          onClick={goNext}
          className="cook-nav__btn cook-nav__btn--primary"
        >
          {stepIndex === totalSteps - 1 ? "Terminar" : "Siguiente"}
          {stepIndex < totalSteps - 1 ? (
            <ChevronRight className="size-5" />
          ) : (
            <Check className="size-5" />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {showIngredients && (
          <>
            <motion.button
              type="button"
              className="cook-drawer__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Cerrar ingredientes"
              onClick={() => setShowIngredients(false)}
            />
            <motion.aside
              className="cook-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cook-ingredients-title"
              initial={reduce ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? undefined : { x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="cook-drawer__head">
                <div>
                  <p className="cook-drawer__eyebrow">Lista de compra</p>
                  <h2 id="cook-ingredients-title" className="cook-drawer__title">
                    Ingredientes
                  </h2>
                </div>
                <button
                  type="button"
                  className="cook-top__icon"
                  onClick={() => setShowIngredients(false)}
                  aria-label="Cerrar"
                >
                  <X className="size-5" />
                </button>
              </div>
              <ul className="cook-drawer__list">
                {receta.ingredientes.map((ing) => {
                  const on = Boolean(checked[ing.id]);
                  return (
                    <li key={ing.id}>
                      <label className={`cook-ing ${on ? "is-checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            setChecked((prev) => ({
                              ...prev,
                              [ing.id]: !prev[ing.id],
                            }))
                          }
                        />
                        <span className="cook-ing__name">{ing.nombre}</span>
                        <span className="cook-ing__qty tabular-nums">
                          {ing.cantidadBase} {ing.unidad}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="cook-drawer__foot">
                <AmazonAffiliate categoria={receta.categoria} limit={2} compact />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function CookTimerPanel({
  pasoSeconds,
  timer,
  timerAlert,
  onStart,
  onClearAlert,
  compact = false,
}: {
  pasoSeconds: number;
  timer: ReturnType<typeof useCookTimer>;
  timerAlert: boolean;
  onStart: () => void;
  onClearAlert: () => void;
  compact?: boolean;
}) {
  const timerActive = timer.status === "running" || timer.status === "paused";

  return (
    <div className={`cook-timer-panel ${compact ? "cook-timer-panel--compact" : ""}`}>
      {timerAlert && (
        <div className="cook-timer-alert" role="alert">
          ¡Tiempo terminado! Revisa el fuego y sigue al siguiente paso.
        </div>
      )}

      {(timerActive || timer.status === "done") && (
        <CircularTimer
          remaining={timer.status === "done" ? 0 : timer.remaining}
          total={timer.total || pasoSeconds}
          done={timer.status === "done"}
          size={compact ? 168 : 220}
        />
      )}

      {timer.status === "idle" && (
        <div className="cook-timer-idle">
          <p className="cook-timer-idle__value tabular-nums">
            {formatMin(pasoSeconds)}
          </p>
          <p className="cook-timer-idle__label">Temporizador</p>
        </div>
      )}

      <div className="cook-timer-actions">
        {timer.status === "idle" && (
          <button type="button" onClick={onStart} className="cook-nav__btn cook-nav__btn--primary">
            <Play className="size-5" />
            Iniciar
          </button>
        )}
        {timer.status === "running" && (
          <button
            type="button"
            onClick={timer.pause}
            className="cook-nav__btn cook-nav__btn--ghost"
          >
            <Pause className="size-5" />
            Pausar
          </button>
        )}
        {timer.status === "paused" && (
          <button
            type="button"
            onClick={timer.resume}
            className="cook-nav__btn cook-nav__btn--primary"
          >
            <Play className="size-5" />
            Reanudar
          </button>
        )}
        {(timer.status === "running" || timer.status === "paused") && (
          <button
            type="button"
            onClick={timer.skip}
            className="cook-nav__btn cook-nav__btn--ghost"
          >
            <SkipForward className="size-5" />
            Saltar
          </button>
        )}
        {timer.status === "done" && (
          <button
            type="button"
            onClick={() => {
              onClearAlert();
              timer.reset();
            }}
            className="cook-nav__btn cook-nav__btn--ghost"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
}
