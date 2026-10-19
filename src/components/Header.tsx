import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, CalendarCheck, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { cn, scrollToId } from "@/lib/utils";
import { useLockBody, useScrollProgress } from "@/lib/hooks";
import { useContent } from "@/lib/content";

const LINKS = [
  { label: "Menu", href: "#menu" },
  { label: "La Meccanica", href: "#storia" },
  { label: "Eventi", href: "#eventi" },
  { label: "Promo", href: "#promo" },
  { label: "Dove siamo", href: "#dove-siamo" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { scrolled, progress } = useScrollProgress();
  const location = useLocation();
  const { content } = useContent();
  const phone = content?.settings.venue?.phone ?? "0331 055605";

  useLockBody(open);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const go = (href: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    scrollToId(href.replace("#", ""));
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "glass-nav py-2" : "py-4",
        )}
      >
        <div className="shell flex items-center justify-between gap-6">
          <Logo compact={scrolled} />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigazione principale">
            {LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="link-underline text-[0.72rem] font-bold tracking-[0.18em] text-cream/70 uppercase transition-colors hover:text-cream"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="grid size-10 place-items-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-ember/60 hover:text-ember"
              aria-label="Chiama La Meccanica"
            >
              <Phone className="size-4" />
            </a>
            <Link to="/prenota" className="btn btn-flame btn-sm">
              <CalendarCheck className="size-3.5" />
              Prenota
            </Link>
          </div>

          <button
            onClick={() => setOpen((value) => !value)}
            className="grid size-11 place-items-center rounded-full border border-cream/20 text-cream lg:hidden"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <div className="shell mt-2 hidden lg:block">
          <div className="h-px w-full overflow-hidden bg-cream/10">
            <div
              className="h-full bg-flame transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-full flex-col justify-between px-6 pt-28 pb-10">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link, index) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="group flex items-center justify-between border-b border-cream/10 py-4 text-left transition-all"
                style={{
                  transitionDelay: `${index * 40}ms`,
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(14px)",
                }}
              >
                <span className="font-display text-3xl text-cream">{link.label}</span>
                <span className="text-[0.6rem] tracking-[0.2em] text-dim">
                  0{index + 1}
                </span>
              </button>
            ))}
          </nav>

          <div className="space-y-3">
            <Link to="/prenota" className="btn btn-flame w-full">
              <CalendarCheck className="size-4" />
              Prenota un tavolo
            </Link>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn btn-ghost w-full">
              <Phone className="size-4" />
              {phone}
            </a>
            <Link
              to="/admin"
              className="block pt-2 text-center text-[0.6rem] tracking-[0.2em] text-dim/60 uppercase"
            >
              Area riservata
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
