"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const PLACEHOLDER = "/images/placeholder-receta.svg";

type RecipeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
};

/** Imagen de receta con fallback al placeholder si falla la carga. */
export function RecipeImage({ src, alt, ...props }: RecipeImageProps) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      onError={() => {
        if (current !== PLACEHOLDER) setCurrent(PLACEHOLDER);
      }}
    />
  );
}

