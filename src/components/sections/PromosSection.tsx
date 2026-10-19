import { ArrowUpRight, CalendarDays, Tag } from "lucide-react";
import { useContent } from "@/lib/content";
import { Reveal, SectionHeading } from "../Reveal";
import { Link } from "react-router-dom";

const DAY_LABELS = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

export function PromosSection() {
  const { content } = useContent();
  const promos = content?.promos ?? [];
  const today = new Date().getDay();

  if (!promos.length) return null;

  return (
    <section id="promo" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Promo attive"
          title="Ogni sera ha"
          italic="il suo motivo"
          description="Offerte che girano con la settimana. Nessuna carta fedeltà, nessun codice: ti siedi e ne approfitti."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {promos.map((promo, index) => {
            const isToday = promo.dayOfWeek === today;
            return (
              <Reveal key={promo.id} delay={index * 80}>
                <article
                  className={`group relative h-full overflow-hidden rounded-[24px] border p-6 transition-all duration-500 md:p-8 ${
                    isToday
                      ? "border-ember/45 bg-gradient-to-br from-ember/12 to-transparent"
                      : "border-cream/10 bg-ink-2/50 hover:border-cream/25"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-[0.6rem] font-bold tracking-[0.16em] uppercase">
                        <CalendarDays className="size-3" />
                        {promo.badge || (promo.dayOfWeek !== null ? DAY_LABELS[promo.dayOfWeek] : "Sempre")}
                      </span>
                      {isToday && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-flame px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.14em] text-white uppercase">
                          Oggi
                        </span>
                      )}
                    </div>
                    <Tag className="size-4 shrink-0 text-dim/50 transition-colors group-hover:text-ember" />
                  </div>

                  <h3 className="mt-5 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight text-cream">
                    {promo.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[0.88rem] leading-relaxed text-dim">
                    {promo.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[0.66rem] font-bold tracking-[0.18em] text-ember uppercase">
                    <span>Disponibile in sala</span>
                    <span className="h-px w-8 bg-ember/40 transition-all duration-500 group-hover:w-14" />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[24px] border border-cream/10 bg-cream/[0.03] p-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-xl text-cream">Gruppi, aziende, compleanni?</p>
              <p className="mt-1 text-[0.85rem] text-dim">
                Costruiamo menu e spazi su misura. Scrivici e ne parliamo.
              </p>
            </div>
            <Link to="/prenota?tipo=evento" className="btn btn-flame btn-sm shrink-0">
              Richiedi preventivo
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
