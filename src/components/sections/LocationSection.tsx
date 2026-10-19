import { useState } from "react";
import { Clock, MapPin, Phone, Mail, ArrowUpRight, Check, Copy } from "lucide-react";
import { useContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "../Reveal";
import { Link } from "react-router-dom";

export function LocationSection() {
  const { content } = useContent();
  const venue = content?.settings.venue;
  const hours = content?.hours ?? [];
  const today = new Date().getDay();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venue?.address ?? "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard non disponibile */
    }
  };

  return (
    <section id="dove-siamo" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Dove siamo"
          title="Due passi dalla"
          italic="stazione"
          description="A Canegrate, tra Legnano e Parabiago. Via Tagliamento 16A, con parcheggio in zona."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {/* map */}
          <Reveal className="lg:col-span-7">
            <div className="relative h-full min-h-[22rem] overflow-hidden rounded-[26px] border border-cream/10">
              <iframe
                title="Mappa La Meccanica"
                src="https://www.openstreetmap.org/export/embed.html?bbox=8.9180%2C45.5680%2C8.9420%2C45.5820&layer=mapnik&marker=45.5750%2C8.9300"
                className="size-full min-h-[22rem] grayscale-[0.85] contrast-[1.05] invert-[0.92] hue-rotate-180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-2xl border border-cream/15 bg-ink/80 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-ember" />
                  <p className="text-[0.82rem] leading-snug text-cream">
                    {venue?.address ?? "Via Tagliamento 16A, 20039 Canegrate (MI)"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={copyAddress} className="btn btn-ghost btn-sm">
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? "Copiato" : "Copia"}
                  </button>
                  <a
                    href={venue?.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-flame btn-sm"
                  >
                    Indicazioni
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* hours + contacts */}
          <div className="grid gap-5 lg:col-span-5">
            <Reveal delay={80}>
              <div className="rounded-[26px] border border-cream/10 bg-ink-2/60 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-xl">
                    <Clock className="size-4 text-ember" />
                    Orari
                  </h3>
                  <span className="text-[0.58rem] font-bold tracking-[0.18em] text-dim uppercase">
                    Oggi
                  </span>
                </div>
                <ul className="mt-4 divide-y divide-cream/8">
                  {hours.map((row) => (
                    <li
                      key={row.dayOfWeek}
                      className={cn(
                        "flex items-center justify-between gap-4 py-2.5 text-[0.82rem]",
                        row.dayOfWeek === today ? "text-cream" : "text-cream/60",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {row.dayOfWeek === today && (
                          <span className="size-1.5 rounded-full bg-flame" />
                        )}
                        {row.label}
                      </span>
                      <span className="text-right tabular-nums">
                        {row.isClosed ? (
                          <span className="text-dim/60">Chiuso</span>
                        ) : (
                          <span className="flex flex-col items-end gap-0.5 text-[0.78rem]">
                            {row.lunchOpen && (
                              <span>
                                {row.lunchOpen}–{row.lunchClose}
                              </span>
                            )}
                            {row.dinnerOpen && (
                              <span>
                                {row.dinnerOpen}–{row.dinnerClose}
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="rounded-[26px] border border-cream/10 bg-gradient-to-br from-cream/[0.06] to-transparent p-6">
                <h3 className="font-display text-xl">Parliamone</h3>
                <p className="mt-1 text-[0.8rem] text-dim">
                  Per gruppi, allergie o richieste particolari chiamaci: rispondiamo noi.
                </p>
                <div className="mt-5 space-y-2">
                  <a
                    href={`tel:${(venue?.phone ?? "").replace(/\s/g, "")}`}
                    className="flex items-center justify-between rounded-xl border border-cream/10 px-3.5 py-3 text-[0.82rem] transition-colors hover:border-ember/50"
                  >
                    <span className="flex items-center gap-2.5">
                      <Phone className="size-3.5 text-ember" />
                      {venue?.phone}
                    </span>
                    <ArrowUpRight className="size-3.5 text-dim" />
                  </a>
                  <a
                    href={`mailto:${venue?.email}`}
                    className="flex items-center justify-between rounded-xl border border-cream/10 px-3.5 py-3 text-[0.82rem] transition-colors hover:border-ember/50"
                  >
                    <span className="flex items-center gap-2.5">
                      <Mail className="size-3.5 text-ember" />
                      {venue?.email}
                    </span>
                    <ArrowUpRight className="size-3.5 text-dim" />
                  </a>
                  <Link to="/prenota" className="btn btn-flame w-full">
                    Prenota online
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
