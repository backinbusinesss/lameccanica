import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { useContent } from "@/lib/content";

export function Footer() {
  const { content } = useContent();
  const venue = content?.settings.venue;
  const hours = content?.hours ?? [];

  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-ink-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70rem] -translate-x-1/2 rounded-full bg-flame/12 blur-[120px]"
      />

      <div className="shell relative py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-dim">
              {venue?.claim ??
                "C’è sempre un buon motivo per vivere la Meccanica. Burger, cocktail e live music a Canegrate."}
            </p>
            <div className="mt-7 flex items-center gap-3">
              {venue?.instagram && (
                <a
                  href={venue.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream/70 transition-all hover:-translate-y-0.5 hover:border-ember/60 hover:text-ember"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4" />
                </a>
              )}
              {venue?.facebook && (
                <a
                  href={venue.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream/70 transition-all hover:-translate-y-0.5 hover:border-ember/60 hover:text-ember"
                  aria-label="Facebook"
                >
                  <Facebook className="size-4" />
                </a>
              )}
              {venue?.whatsapp && (
                <a
                  href={`https://wa.me/${venue.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-sm"
                >
                  WhatsApp
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[0.65rem] font-bold tracking-[0.24em] text-dim uppercase">Orari</h3>
            <ul className="mt-5 space-y-2 text-sm">
              {hours.map((h) => (
                <li key={h.dayOfWeek} className="flex justify-between gap-4 text-cream/75">
                  <span className="text-dim">{h.label.slice(0, 3)}</span>
                  <span className="tabular-nums">
                    {h.isClosed
                      ? "Chiuso"
                      : [h.lunchOpen, h.dinnerOpen].filter(Boolean).join(" · ") || "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-[0.65rem] font-bold tracking-[0.24em] text-dim uppercase">
              Contatti
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-cream/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ember" />
                <a
                  href={venue?.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline"
                >
                  {venue?.address ?? "Via Tagliamento 16A, Canegrate (MI)"}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-ember" />
                <a href={`tel:${(venue?.phone ?? "").replace(/\s/g, "")}`} className="link-underline">
                  {venue?.phone ?? "0331 055605"}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-ember" />
                <a href={`mailto:${venue?.email}`} className="link-underline">
                  {venue?.email ?? "info@arealameccanica.com"}
                </a>
              </li>
            </ul>
            <p className="mt-6 text-[0.7rem] leading-relaxed text-dim/70">
              Coperto {venue?.coperto ?? "2,00 €"}. {venue?.paymentNote}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/10 pt-6 text-[0.68rem] text-dim/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} La Meccanica · P.IVA 08391580969</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="link-underline">
              Privacy
            </Link>
            <Link to="/prenota" className="link-underline">
              Prenotazioni
            </Link>
            <Link to="/admin" className="link-underline text-dim/50">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
