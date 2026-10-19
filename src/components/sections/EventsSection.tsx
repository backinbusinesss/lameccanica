import { ArrowUpRight, Music4, CalendarDays } from "lucide-react";
import { useContent } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Reveal, SectionHeading } from "../Reveal";
import { Link } from "react-router-dom";

export function EventsSection() {
  const { content } = useContent();
  const events = content?.events ?? [];

  if (!events.length) return null;

  return (
    <section id="eventi" className="relative scroll-mt-20 overflow-hidden py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-flame/10 blur-[120px]"
      />
      <div className="shell relative">
        <SectionHeading
          eyebrow="Eventi & live"
          title="La serata non"
          italic="finisce a cena"
          description="Live music, DJ set, serate a tema e cene aziendali. Il calendario cambia spesso: qui trovi sempre cosa succede."
          action={
            <Link to="/prenota" className="btn btn-ghost btn-sm">
              Prenota per un evento
              <ArrowUpRight className="size-3.5" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {events.map((event, index) => (
            <Reveal key={event.id} delay={index * 90}>
              <article className="group relative h-full overflow-hidden rounded-[26px] border border-cream/10">
                <img
                  src={event.imageUrl || "/assets/img/live.webp"}
                  alt={event.title}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
                <div className="relative flex h-full min-h-[24rem] flex-col justify-end p-6 md:min-h-[28rem] md:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    {event.badge && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-flame px-3 py-1 text-[0.58rem] font-bold tracking-[0.16em] text-white uppercase">
                        <Music4 className="size-3" />
                        {event.badge}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 bg-ink/40 px-3 py-1 text-[0.58rem] font-bold tracking-[0.16em] uppercase backdrop-blur-md">
                      <CalendarDays className="size-3" />
                      {event.eventDate ? formatDate(event.eventDate) : event.eventTime}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[0.98] text-cream">
                    {event.title}
                  </h3>
                  {event.subtitle && (
                    <p className="mt-2 text-[0.72rem] font-bold tracking-[0.2em] text-ember uppercase">
                      {event.subtitle}
                    </p>
                  )}
                  <p className="mt-3 max-w-md text-[0.88rem] leading-relaxed text-cream/70">
                    {event.description}
                  </p>

                  <Link
                    to="/prenota?tipo=evento"
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-cream/25 bg-ink/40 px-4 py-2.5 text-[0.68rem] font-bold tracking-[0.16em] uppercase backdrop-blur-md transition-all hover:border-ember/70 hover:bg-flame hover:text-white"
                  >
                    {event.ctaLabel}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
