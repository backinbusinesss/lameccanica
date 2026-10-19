import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { useContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { ReservationWizard } from "@/components/sections/ReservationWizard";

export function ReservePage() {
  const { content } = useContent();
  const venue = content?.settings.venue;

  return (
    <div className="relative overflow-hidden pt-28 pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-flame/12 blur-[140px]"
      />
      <div className="shell relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Prenotazioni</span>
          <h1 className="mt-4 text-[clamp(2.6rem,6.4vw,4.8rem)]">
            Il tuo tavolo
            <br />
            <span className="display-italic text-ember">ti aspetta.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-dim">
            Scegli data, orario e zona. Ti confermiamo noi via telefono o WhatsApp, di solito entro
            poche ore.
          </p>
        </Reveal>

        <div className="mt-12">
          <ReservationWizard />
        </div>

        <Reveal className="mt-16 grid gap-4 border-t border-cream/10 pt-10 sm:grid-cols-3">
          <div>
            <ShieldCheck className="size-5 text-ember" />
            <h2 className="mt-3 font-display text-lg">Nessun anticipo</h2>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-dim">
              Prenotare è gratuito. Nessuna carta richiesta, nessun deposito.
            </p>
          </div>
          <div>
            <ShieldCheck className="size-5 text-ember" />
            <h2 className="mt-3 font-display text-lg">Allergie gestite</h2>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-dim">
              Segnala intolleranze nel form: la cucina viene avvisata prima del servizio.
            </p>
          </div>
          <div>
            <ShieldCheck className="size-5 text-ember" />
            <h2 className="mt-3 font-display text-lg">Gruppi numerosi</h2>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-dim">
              Oltre {content?.settings.reservation?.maxParty ?? 10} persone scrivici su WhatsApp:
              organizziamo tutto.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-center gap-3 rounded-2xl border border-cream/10 bg-cream/[0.03] p-5">
          <p className="flex-1 text-[0.85rem] text-dim">
            Preferisci parlare con noi? Chiamaci, rispondiamo durante gli orari di apertura.
          </p>
          <a href={`tel:${(venue?.phone ?? "").replace(/\s/g, "")}`} className="btn btn-flame btn-sm">
            {venue?.phone ?? "0331 055605"}
            <ArrowUpRight className="size-3.5" />
          </a>
          <Link to="/" className="btn btn-ghost btn-sm">
            Torna alla home
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
