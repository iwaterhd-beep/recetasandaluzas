import type { Transition, Variants } from "framer-motion";

/** Transiciones compartidas — respeta prefers-reduced-motion en runtime vía useReducedMotion */
export const easeOut: Transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 22,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: easeOut },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: springSnappy },
};
