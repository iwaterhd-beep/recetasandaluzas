"use client";

interface CircularTimerProps {
  remaining: number;
  total: number;
  size?: number;
  /** true cuando el tiempo ha llegado a 0 */
  done?: boolean;
}

function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function CircularTimer({
  remaining,
  total,
  size = 220,
  done = false,
}: CircularTimerProps) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = total > 0 ? remaining / total : 0;
  const offset = c * (1 - progress);
  const urgent = !done && remaining > 0 && remaining <= 30;
  const strokeColor = done
    ? "var(--aceituna)"
    : urgent
      ? "var(--tomate)"
      : "var(--olivo)";

  return (
    <div
      className={`cook-timer ${done ? "cook-timer--done" : ""} ${urgent ? "cook-timer--urgent" : ""}`}
      style={{ width: size, height: size }}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={done ? "Tiempo terminado" : `Quedan ${formatTime(remaining)}`}
    >
      <svg width={size} height={size} className="cook-timer__svg" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          className="cook-timer__progress"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="cook-timer__face">
        <span className="cook-timer__digits tabular-nums">
          {done ? "0:00" : formatTime(remaining)}
        </span>
        <span className="cook-timer__caption">
          {done ? "Listo" : urgent ? "Últimos segundos" : "restantes"}
        </span>
      </div>
    </div>
  );
}
