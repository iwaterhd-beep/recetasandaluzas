import { Star } from "lucide-react";

interface StarsProps {
  value: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

export function Stars({ value, size = "sm", showValue = true, className = "" }: StarsProps) {
  const dim = size === "sm" ? "size-3.5" : "size-4";
  const full = Math.floor(value);
  const partial = value - full >= 0.3;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${value} de 5 estrellas`}>
      <span className="inline-flex text-aceite">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < full || (i === full && partial);
          return (
            <Star
              key={i}
              className={`${dim} ${filled ? "fill-aceite text-aceite" : "text-border-strong"}`}
              aria-hidden
            />
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}
