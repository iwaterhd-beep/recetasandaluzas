"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import type { RecetaResumen } from "@/types/receta";

interface HomeHeroProps {
  slides: RecetaResumen[];
  totalRecetas: number;
}

export function HomeHero({ slides, totalRecetas }: HomeHeroProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [q, setQ] = useState("");
  const current = slides[index] ?? slides[0];

  useEffect(() => {
    if (reduce || slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [reduce, slides.length]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/recetas?q=${encodeURIComponent(query)}` : "/recetas");
  };

  if (!current) return null;

  return (
    <section className="bg-background">
      <div className="relative isolate overflow-hidden md:container-app md:pt-4">
        <div className="relative min-h-[min(58vh,480px)] w-full overflow-hidden md:min-h-[min(62vh,540px)] md:rounded-[var(--radius-xl)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.55 }}
            >
              <Image
                src={current.imagen}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
            aria-hidden
          />

          <div className="relative flex min-h-[min(62vh,520px)] flex-col justify-end px-5 pb-7 pt-14 md:min-h-[min(62vh,540px)] md:px-10 md:pb-10">
            <p className="font-sans text-[clamp(1.35rem,4.5vw,1.85rem)] font-extrabold tracking-tight text-white">
              {SITE.name}
            </p>
            <h1 className="mt-3 max-w-xl font-sans text-[clamp(1.55rem,4.8vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-white/95">
              {current.nombre}
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/80 md:text-base">
              Cocina guiada · {totalRecetas} recetas
            </p>

            <form
              onSubmit={onSearch}
              className="mt-5 flex w-full max-w-md items-center gap-2 rounded-full bg-white p-1.5 shadow-[var(--shadow-lift)]"
              role="search"
            >
              <Search
                className="ml-3 size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar recetas…"
                aria-label="Buscar recetas"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="btn btn-primary min-h-11 rounded-full px-5"
              >
                Buscar
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                href={`/recetas/${current.id}/cocinar`}
                className="btn btn-primary min-h-12"
              >
                Empezar a cocinar
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={`/recetas/${current.id}`}
                className="btn min-h-12 border-0 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
              >
                Ver ficha
              </Link>
            </div>

            {slides.length > 1 && (
              <div className="mt-5 flex gap-1.5" aria-hidden>
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Ir a ${s.nombre}`}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
