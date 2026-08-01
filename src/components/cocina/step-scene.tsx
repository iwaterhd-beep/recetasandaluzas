"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  cookActionLabel,
  cookActionTip,
  detectCookAction,
  type CookTipLiquid,
} from "@/lib/cook-actions";
import { resolveCookPackAnimation } from "@/lib/cook-pack-animations";
import { CookLottie } from "@/components/cocina/cook-lottie";

interface StepSceneProps {
  titulo: string;
  descripcion: string;
  className?: string;
  compact?: boolean;
  hideTip?: boolean;
  liquid?: CookTipLiquid;
}

/**
 * Escena del paso: animación del pack Food & Drinks (IconScout / Noto)
 * elegida por la acción detectada en el texto.
 */
export function StepScene({
  titulo,
  descripcion,
  className = "",
  compact = false,
  hideTip = false,
  liquid = null,
}: StepSceneProps) {
  const reduce = useReducedMotion();
  const action = detectCookAction(titulo, descripcion);
  const packSlug = resolveCookPackAnimation(action, titulo, descripcion, liquid);
  const label = cookActionLabel(action, titulo);
  const tip = cookActionTip(action, titulo, descripcion, liquid);

  return (
    <div
      className={`cook-scene ${compact ? "cook-scene--compact" : ""} ${className}`}
      aria-hidden
    >
      <div className="cook-scene__stage">
        {!reduce && <span className="cook-scene__glow" />}

        <motion.div
          key={`${action}-${packSlug}`}
          className="cook-scene__tm-wrap"
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        >
          <CookLottie slug={packSlug} compact={compact} reduce={!!reduce} />
        </motion.div>
      </div>

      {!hideTip && (
        <div className="cook-scene__meta">
          <span className="cook-scene__chip">{label}</span>
          {!compact && <p className="cook-scene__tip">{tip}</p>}
        </div>
      )}
    </div>
  );
}
