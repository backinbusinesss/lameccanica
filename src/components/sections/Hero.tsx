import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Clock, Star } from "lucide-react";
import { useContent } from "@/lib/content";
import { scrollToId } from "@/lib/utils";
import { Marquee } from "../Marquee";

const FALLBACK_IMAGE = "/assets/img/hero-burger.webp";

export function Hero() {
  const { content } = useContent();
  const hero = content?.settings.hero;
  const hours = content?.hours ?? [];
  const [offset, setOffset] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setOffset(Math.min(window.scrollY, 900));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, []);

  const today = new Date().getDay();
  const todayRow = hours.find((h) => h.dayOfWeek === today);
  const now = new Date();
  const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const isOpen =
    Boolean(todayRow) &&
    !todayRow?.isClosed &&
    [todayRow?.lunchOpen, todayRow?.dinnerOpen].some((open, index) => {
      const close = index === 0 ? todayRow?.lunchClose : todayRow?.dinnerClose;
      if (!open || !close) return false;
      return close < open
        ? current >= open || current <= close
        : current >= open && current <= close;
    });

  return (
    <section className="relative min-h-[100svh] overflow-hidden pb-24">
      {/* background */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src={hero?.image || FALLBACK_IMAGE}
          alt="Burger artigianale de La Maccanica"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          className={`size-full object-cover transition-[transform,opacity] duration-[1400ms] ease-out ${
            loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
          style={{ transform: `translate3d(0, ${offset * 0.18}px, 0) scale(1.03)` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,transparent_0%,rgba(11,10,8,0.35)_45%,rgba(11,10,8,0.94)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(11,10,8,0.92)_0%,rgba(11,10,8,0.55)_45%,transparent_75%)]" />
      </div>

      {/* glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 size-[36rem] rounded-full bg-flame/20 blur-[140px]"
      />

      <div className="shell relative flex min-h-[100svh] flex-col justify-end pt-32 pb-16 md:justify-center md:pt-28">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-ink/40 px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.22em] uppercase backdrop-blur-md">
              <span
                className={`size-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse-soft" : "bg-flame"}`}
              />
              {isOpen ? "Aperto ora" : "Chiuso · prenota online"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[0.22em] text-dim uppercase">
              <Star className="size-3 fill-ember text-ember" />
              4,7 · 2.400+ recensioni
            </span>
          </div>

          <h1
            className="mt-6 text-[clamp(3rem,8.6vw,7.2rem)] leading-[0.88]"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 1s ease 120ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) 120ms",
            }}
          >
            {hero?.title ?? "Carne vera. Fuoco vero. Notte vera."}
          </h1>

          <p
            className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-cream/70 md:text-[1.05rem]"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 1s ease 320ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) 320ms",
            }}
          >
            {hero?.subtitle ??
              "Burger artigianali, cocktail firmati e live music fino a tardi. La Maccanica è il posto dove la cena diventa serata."}
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-3"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 1s ease 440ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) 440ms",
            }}
          >
            <Link to="/prenota" className="btn btn-flame">
              {hero?.primaryCta ?? "Prenota un tavolo"}
              <ArrowUpRight className="size-4" />
            </Link>
            <button onClick={() => scrollToId("menu")} className="btn btn-ghost">
              {hero?.secondaryCta ?? "Scopri il menu"}
            </button>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-[0.7rem] tracking-[0.12em] text-dim uppercase">
            <span className="flex items-center gap-2">
              <Clock className="size-3.5 text-ember" />
              {todayRow?.isClosed
                ? "Oggi chiuso"
                : todayRow
                  ? `Oggi ${[todayRow.lunchOpen, todayRow.dinnerOpen].filter(Boolean).join(" · ")}`
                  : "Aperti da mercoledì a domenica"}
            </span>
            <span className="hidden h-3 w-px bg-cream/20 sm:block" />
            <span>Via Tagliamento 16A · Canegrate</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-y border-cream/10 bg-ink/50 backdrop-blur-md">
        <Marquee items={hero?.marquee ?? ["BURGER", "COCKTAIL", "LIVE MUSIC"]} slow />
      </div>

      <button
        onClick={() => scrollToId("menu")}
        className="absolute right-6 bottom-28 z-10 hidden size-12 place-items-center rounded-full border border-cream/20 text-cream/60 transition-colors hover:border-ember/60 hover:text-ember md:grid"
        aria-label="Scorri al menu"
      >
        <ArrowDown className="size-4 animate-bounce" />
      </button>
    </section>
  );
}
