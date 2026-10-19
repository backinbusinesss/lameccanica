import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      to="/"
      aria-label="La Maccanica — home"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span className="relative grid size-10 place-items-center rounded-full border border-cream/25 bg-cream/5 transition-colors duration-500 group-hover:border-ember/70">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden="true">
          <path
            d="M5 21h22M5 17.5C5 12 10 8 16 8s11 4 11 9.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="11" cy="24" r="1.1" fill="#ff4d1c" />
          <circle cx="16" cy="24" r="1.1" fill="#ff4d1c" />
          <circle cx="21" cy="24" r="1.1" fill="#ff4d1c" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.02rem] font-semibold tracking-[-0.02em] text-cream">
          La Maccanica
        </span>
        {!compact && (
          <span className="mt-1 text-[0.52rem] font-bold uppercase tracking-[0.34em] text-dim">
            Canegrate · Milano
          </span>
        )}
      </span>
    </Link>
  );
}
