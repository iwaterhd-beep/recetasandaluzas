"use client";

import type { CookAction } from "@/lib/cook-actions";

interface TmSceneProps {
  action: CookAction;
  foodSrc: string;
  foodAlt: string;
  secondarySrc?: string;
  compact?: boolean;
  reduce?: boolean;
}

/**
 * Escenas estilo Guided Cooking (Thermomix/Cookidoo):
 * círculo blanco + ilustración plana con movimiento de técnica.
 */
export function TmActionScene({
  action,
  foodSrc,
  foodAlt,
  secondarySrc,
  compact = false,
  reduce = false,
}: TmSceneProps) {
  const cls = `tm-scene tm-scene--${action} ${compact ? "tm-scene--compact" : ""} ${
    reduce ? "tm-scene--static" : ""
  }`;

  switch (action) {
    case "cortar":
    case "fruta":
      return (
        <div className={cls} aria-hidden>
          <Board />
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--cut" />
          <span className="tm-scene__cutline tm-scene__cutline--1" />
          <span className="tm-scene__cutline tm-scene__cutline--2" />
          <Knife />
        </div>
      );

    case "hervir":
      return (
        <div className={cls} aria-hidden>
          <Pot />
          <div className="tm-scene__bubbles">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="tm-scene__steam">
            <i />
            <i />
            <i />
          </div>
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--boil" />
        </div>
      );

    case "freir":
    case "sofrito":
      return (
        <div className={cls} aria-hidden>
          <Pan />
          <span className="tm-scene__oil" />
          <div className="tm-scene__sizzle">
            <i />
            <i />
            <i />
            <i />
          </div>
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--fry" />
        </div>
      );

    case "mezclar":
    case "triturar":
      return (
        <div className={cls} aria-hidden>
          <Bowl />
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--mix" />
          {secondarySrc && (
            <Food
              src={secondarySrc}
              alt=""
              className="tm-scene__food tm-scene__food--mix-2"
            />
          )}
          <Whisk />
        </div>
      );

    case "aliñar":
    case "empapar":
      return (
        <div className={cls} aria-hidden>
          <Bowl />
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--bowl" />
          <div className="tm-scene__pour">
            <span className="tm-scene__pour-stream" />
            <span className="tm-scene__pour-drop" />
          </div>
          {secondarySrc ? (
            <Food
              src={secondarySrc}
              alt=""
              className="tm-scene__food tm-scene__food--pour-src"
            />
          ) : (
            <Jug />
          )}
        </div>
      );

    case "hornear":
      return (
        <div className={cls} aria-hidden>
          <Oven />
          <div className="tm-scene__heat">
            <i />
            <i />
            <i />
          </div>
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--oven" />
        </div>
      );

    case "amasar":
      return (
        <div className={cls} aria-hidden>
          <Board />
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--dough" />
          <Hands />
        </div>
      );

    case "rebozar":
      return (
        <div className={cls} aria-hidden>
          <Bowl shallow />
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--dip" />
          <Hands />
        </div>
      );

    case "enfriar":
      return (
        <div className={cls} aria-hidden>
          <Board />
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--rest" />
          <div className="tm-scene__frost">
            <i />
            <i />
            <i />
          </div>
        </div>
      );

    case "servir":
      return (
        <div className={cls} aria-hidden>
          <Plate />
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--serve" />
          {secondarySrc && (
            <Food
              src={secondarySrc}
              alt=""
              className="tm-scene__food tm-scene__food--serve-2"
            />
          )}
        </div>
      );

    case "preparar":
    case "cocinar":
    default:
      return (
        <div className={`${cls} tm-scene--generic`} aria-hidden>
          <Board />
          <Food src={foodSrc} alt={foodAlt} className="tm-scene__food tm-scene__food--generic" />
          {secondarySrc && (
            <Food
              src={secondarySrc}
              alt=""
              className="tm-scene__food tm-scene__food--generic-2"
            />
          )}
        </div>
      );
  }
}

function Food({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- WebP animados / assets cocina
    <img src={src} alt={alt} className={className} decoding="async" draggable={false} />
  );
}

function Knife() {
  return (
    <svg className="tm-scene__knife" viewBox="0 0 120 40" aria-hidden>
      <defs>
        <linearGradient id="tm-blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8ecef" />
          <stop offset="55%" stopColor="#f7f9fa" />
          <stop offset="100%" stopColor="#c5ccd3" />
        </linearGradient>
      </defs>
      <rect x="62" y="10" width="48" height="16" rx="3" fill="#3a5a28" />
      <rect x="66" y="13" width="12" height="10" rx="1.5" fill="#2a421c" opacity="0.35" />
      <path
        d="M4 18 C18 8, 40 6, 64 12 L64 24 C40 28, 18 28, 4 20 Z"
        fill="url(#tm-blade)"
        stroke="#9aa3ad"
        strokeWidth="1"
      />
    </svg>
  );
}

function Board() {
  return (
    <svg className="tm-scene__board" viewBox="0 0 200 80" aria-hidden>
      <ellipse cx="100" cy="44" rx="88" ry="28" fill="#c4a574" />
      <ellipse cx="100" cy="40" rx="88" ry="28" fill="#e2c59a" />
      <ellipse cx="100" cy="40" rx="70" ry="18" fill="#d4b07e" opacity="0.45" />
    </svg>
  );
}

function Pot() {
  return (
    <svg className="tm-scene__pot" viewBox="0 0 160 120" aria-hidden>
      <ellipse cx="80" cy="96" rx="48" ry="8" fill="#000" opacity="0.08" />
      <path
        d="M28 40 h104 v40 c0 22 -22 36 -52 36 s-52 -14 -52 -36 z"
        fill="#5a7340"
      />
      <path
        d="M34 44 h92 v34 c0 18 -20 30 -46 30 s-46 -12 -46 -30 z"
        fill="#3a5a28"
      />
      <ellipse cx="80" cy="44" rx="52" ry="12" fill="#7a9560" />
      <ellipse cx="80" cy="44" rx="40" ry="8" fill="#c8e4f0" />
      <rect x="8" y="52" width="20" height="8" rx="4" fill="#3a5a28" />
      <rect x="132" y="52" width="20" height="8" rx="4" fill="#3a5a28" />
    </svg>
  );
}

function Pan() {
  return (
    <svg className="tm-scene__pan" viewBox="0 0 180 100" aria-hidden>
      <ellipse cx="70" cy="78" rx="52" ry="8" fill="#000" opacity="0.08" />
      <ellipse cx="70" cy="52" rx="54" ry="28" fill="#2c3036" />
      <ellipse cx="70" cy="48" rx="46" ry="22" fill="#4a5058" />
      <ellipse cx="70" cy="46" rx="38" ry="16" fill="#6a727c" />
      <rect x="118" y="42" width="52" height="10" rx="5" fill="#3a5a28" />
    </svg>
  );
}

function Bowl({ shallow = false }: { shallow?: boolean }) {
  return (
    <svg
      className={`tm-scene__bowl ${shallow ? "tm-scene__bowl--shallow" : ""}`}
      viewBox="0 0 160 100"
      aria-hidden
    >
      <ellipse cx="80" cy="78" rx="50" ry="8" fill="#000" opacity="0.07" />
      <path
        d={
          shallow
            ? "M20 40 h120 l-10 28 c-6 16 -30 24 -50 24 s-44 -8 -50 -24 z"
            : "M24 30 h112 l-12 42 c-6 18 -32 28 -54 28 s-48 -10 -54 -28 z"
        }
        fill="#eef0ec"
        stroke="#cfd4c8"
        strokeWidth="2"
      />
      <ellipse
        cx="80"
        cy={shallow ? 40 : 32}
        rx={shallow ? 58 : 54}
        ry="10"
        fill="#f7f8f5"
        stroke="#d8ddd2"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Whisk() {
  return (
    <svg className="tm-scene__whisk" viewBox="0 0 40 100" aria-hidden>
      <rect x="17" y="42" width="6" height="50" rx="3" fill="#3a5a28" />
      <ellipse cx="20" cy="28" rx="14" ry="22" fill="none" stroke="#8a939c" strokeWidth="3" />
      <ellipse cx="20" cy="28" rx="8" ry="16" fill="none" stroke="#8a939c" strokeWidth="2" />
      <path d="M10 18 Q20 8 30 18" fill="none" stroke="#8a939c" strokeWidth="2" />
    </svg>
  );
}

function Jug() {
  return (
    <svg className="tm-scene__jug" viewBox="0 0 60 80" aria-hidden>
      <path
        d="M18 20 h24 v40 c0 10 -6 16 -12 16 s-12 -6 -12 -16 z"
        fill="#7eb8e8"
        opacity="0.85"
      />
      <path d="M18 20 h24 l2 -10 h-28 z" fill="#5a9fd4" />
      <path d="M42 28 c10 2 14 12 8 20" fill="none" stroke="#5a9fd4" strokeWidth="4" />
    </svg>
  );
}

function Oven() {
  return (
    <svg className="tm-scene__oven" viewBox="0 0 140 110" aria-hidden>
      <rect x="20" y="18" width="100" height="78" rx="10" fill="#4a5058" />
      <rect x="30" y="30" width="80" height="50" rx="6" fill="#2c3036" />
      <rect x="38" y="38" width="64" height="34" rx="4" fill="#1a1e22" />
      <circle cx="40" cy="24" r="3" fill="#d4a017" />
      <circle cx="52" cy="24" r="3" fill="#c0392b" />
    </svg>
  );
}

function Plate() {
  return (
    <svg className="tm-scene__plate" viewBox="0 0 180 60" aria-hidden>
      <ellipse cx="90" cy="36" rx="80" ry="16" fill="#000" opacity="0.06" />
      <ellipse cx="90" cy="28" rx="80" ry="18" fill="#f4f5f3" stroke="#d0d4cc" strokeWidth="2" />
      <ellipse cx="90" cy="28" rx="52" ry="10" fill="#e8ebe4" />
    </svg>
  );
}

function Hands() {
  return (
    <svg className="tm-scene__hands" viewBox="0 0 120 50" aria-hidden>
      <ellipse cx="30" cy="28" rx="22" ry="14" fill="#f0c8a0" transform="rotate(-18 30 28)" />
      <ellipse cx="90" cy="28" rx="22" ry="14" fill="#e8b890" transform="rotate(18 90 28)" />
    </svg>
  );
}
