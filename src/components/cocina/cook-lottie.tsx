"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import {
  cookPackWebpSrc,
  type CookPackSlug,
} from "@/lib/cook-pack-animations";

interface CookLottieProps {
  slug: CookPackSlug;
  compact?: boolean;
  reduce?: boolean;
}

type LottieModule = { default: object };

/** Chunks JSON por animación (empaquetados en el build; no dependen de /public en runtime). */
const LOTTIE_LOADERS: Record<CookPackSlug, () => Promise<LottieModule>> = {
  cooking: () =>
    import("@/assets/cook-lottie/cooking.json") as Promise<LottieModule>,
  "steaming-bowl": () =>
    import("@/assets/cook-lottie/steaming-bowl.json") as Promise<LottieModule>,
  spaghetti: () =>
    import("@/assets/cook-lottie/spaghetti.json") as Promise<LottieModule>,
  pour: () => import("@/assets/cook-lottie/pour.json") as Promise<LottieModule>,
  tomato: () =>
    import("@/assets/cook-lottie/tomato.json") as Promise<LottieModule>,
  "root-vegetable": () =>
    import("@/assets/cook-lottie/root-vegetable.json") as Promise<LottieModule>,
  "hot-beverage": () =>
    import("@/assets/cook-lottie/hot-beverage.json") as Promise<LottieModule>,
  burrito: () =>
    import("@/assets/cook-lottie/burrito.json") as Promise<LottieModule>,
  popcorn: () =>
    import("@/assets/cook-lottie/popcorn.json") as Promise<LottieModule>,
  "champagne-bottle": () =>
    import("@/assets/cook-lottie/champagne-bottle.json") as Promise<LottieModule>,
  "clinking-beer-mugs": () =>
    import("@/assets/cook-lottie/clinking-beer-mugs.json") as Promise<LottieModule>,
  "clinking-glasses": () =>
    import("@/assets/cook-lottie/clinking-glasses.json") as Promise<LottieModule>,
  "tropical-drink": () =>
    import("@/assets/cook-lottie/tropical-drink.json") as Promise<LottieModule>,
  "wine-glass": () =>
    import("@/assets/cook-lottie/wine-glass.json") as Promise<LottieModule>,
  bread: () => import("@/assets/cook-lottie/bread.json") as Promise<LottieModule>,
  paper: () => import("@/assets/cook-lottie/paper.json") as Promise<LottieModule>,
  flour: () => import("@/assets/cook-lottie/flour.json") as Promise<LottieModule>,
};

/**
 * Pack Food & Drinks: muestra WebP al instante y sustituye por Lottie al cargar.
 */
export function CookLottie({ slug, compact = false, reduce = false }: CookLottieProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const webp = cookPackWebpSrc(slug);

  useEffect(() => {
    if (reduce) {
      setAnimationData(null);
      return;
    }
    let cancelled = false;
    setAnimationData(null);

    LOTTIE_LOADERS[slug]()
      .then((mod) => {
        const data = mod.default;
        if (!cancelled && data && typeof data === "object" && "layers" in data) {
          setAnimationData(data);
        }
      })
      .catch(() => {
        /* WebP sigue visible */
      });

    return () => {
      cancelled = true;
    };
  }, [slug, reduce]);

  return (
    <div
      className={`cook-pack-anim ${compact ? "cook-pack-anim--compact" : ""} ${
        reduce ? "cook-pack-anim--static" : ""
      }`}
      aria-hidden
    >
      {animationData ? (
        <Lottie
          key={`lottie-${slug}`}
          animationData={animationData}
          loop
          autoplay
          className="cook-pack-anim__media"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`webp-${slug}`}
          src={webp}
          alt=""
          className="cook-pack-anim__media"
          width={512}
          height={512}
          decoding="async"
          draggable={false}
        />
      )}
    </div>
  );
}
