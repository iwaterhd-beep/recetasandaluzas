"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { easeOut, staggerContainer, fadeUp } from "@/lib/motion";

export function HomeHero({ totalRecetas }: { totalRecetas: number }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      <div className="azulejo absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-br from-azul-ceramica-deep/95 via-azul-ceramica/88 to-[#0a2a36]/92"
        aria-hidden
      />
      <motion.div
        className="absolute -top-24 -right-16 size-[28rem] rounded-full bg-aceite/15 blur-3xl"
        aria-hidden
        animate={
          reduce
            ? undefined
            : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute -bottom-32 -left-20 size-[22rem] rounded-full bg-terracota/20 blur-3xl"
        aria-hidden
      />

      <motion.div
        className="container-app relative flex min-h-[78vh] flex-col justify-end pb-16 pt-24 md:min-h-[82vh] md:justify-center md:pb-24 md:pt-20"
        variants={reduce ? undefined : staggerContainer}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="font-display text-[length:var(--text-hero)] font-semibold leading-[0.95] tracking-tight text-white"
        >
          {SITE.name}
        </motion.p>
        <motion.span
          variants={reduce ? undefined : fadeUp}
          className="brand-underline"
          aria-hidden
        />

        <motion.h1
          variants={reduce ? undefined : fadeUp}
          className="mt-7 max-w-xl font-sans text-[length:var(--text-xl)] font-medium leading-snug text-white/92 md:text-[length:var(--text-2xl)]"
        >
          Cocina andaluza paso a paso, como en casa.
        </motion.h1>
        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="mt-3 max-w-md text-[length:var(--text-base)] leading-relaxed text-azul-mist"
        >
          {totalRecetas} recetas tradicionales con temporizador, favoritos y lista de la compra —
          pensado para el móvil entre sartenes.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : fadeUp}
          transition={easeOut}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Link
            href="/recetas"
            className="btn bg-white text-azul-ceramica-deep shadow-[var(--shadow-lift)] hover:bg-cal"
          >
            Explorar recetas
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/categoria/sopas-frias"
            className="btn border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/18"
          >
            Sopas frías
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
