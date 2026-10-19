import { Link } from "react-router-dom";
import { ArrowUpRight, Quote } from "lucide-react";
import { useContent } from "@/lib/content";
import { Reveal } from "../Reveal";
import { Marquee } from "../Marquee";

const STATS = [
  { value: "2015", label: "Da quando accendiamo il fuoco" },
  { value: "180g", label: "Il nostro patty di manzo" },
  { value: "14", label: "Allergeni sempre dichiarati" },
  { value: "02:30", label: "L’ultimo giro del venerdì" },
];

export function StorySection() {
  const { content } = useContent();
  const venue = content?.settings.venue;
  const gallery = content?.gallery ?? [];

  return (
    <section id="storia" className="relative scroll-mt-20 overflow-hidden py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-40 size-[30rem] rounded-full bg-wine/25 blur-[130px]"
      />

      <div className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <Reveal className="relative z-10 overflow-hidden rounded-[28px] border border-cream/12">
              <img
                src={gallery[0]?.url ?? "/assets/img/interior.webp"}
                alt="La sala de La Maccanica"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            </Reveal>

            <Reveal
              delay={180}
              className="absolute -right-3 bottom-6 z-20 w-44 overflow-hidden rounded-2xl border border-cream/15 shadow-2xl sm:-right-6 sm:w-56"
            >
              <img
                src={gallery[2]?.url ?? "/assets/img/burger-double.webp"}
                alt="Double smash burger"
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </Reveal>

            <div className="absolute -top-5 -left-4 z-20 rotate-[-6deg] rounded-xl border border-ember/40 bg-ink/85 px-4 py-2 backdrop-blur-md">
              <span className="font-display text-sm text-ember">Fatto a mano, ogni giorno</span>
            </div>
          </div>

          <div>
            <Reveal>
              <span className="eyebrow">La Maccanica</span>
              <h2 className="mt-4 text-[clamp(2.3rem,5vw,4.2rem)]">
                Non è un ristorante.
                <br />
                <span className="display-italic text-ember">È il tuo posto.</span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-dim">
                <p>
                  A Canegrate, a due passi dalla stazione, c’è un capannone che profuma di brace,
                  luppolo e serate lunghe. Abbiamo iniziato con un piano di lavoro, una piastra e
                  l’idea che un burger potesse essere una cosa seria.
                </p>
                <p>
                  Oggi La Maccanica è ristorante, hamburgeria, cocktail bar e palco. La cucina
                  lavora con carne selezionata e pane artigianale, il bancone gira fino a notte, e
                  il sabato la musica prende il sopravvento.
                </p>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                {STATS.map((stat) => (
                  <div key={stat.label} className="border-l border-cream/15 pl-4">
                    <span className="font-display text-3xl text-cream">{stat.value}</span>
                    <p className="mt-1 text-[0.68rem] leading-snug tracking-[0.08em] text-dim uppercase">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/prenota" className="btn btn-flame">
                  Prenota il tuo tavolo
                  <ArrowUpRight className="size-4" />
                </Link>
                <a href={venue?.instagram} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  Seguici su Instagram
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <div className="relative overflow-hidden rounded-[28px] border border-cream/10 bg-gradient-to-br from-cream/[0.06] to-transparent p-8 md:p-14">
            <Quote className="absolute -top-2 right-6 size-24 text-cream/5" />
            <blockquote className="relative max-w-3xl">
              <p className="font-display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.15] text-cream/90">
                “C’è sempre un buon motivo per vivere la Maccanica.”
              </p>
              <footer className="mt-5 text-[0.68rem] font-bold tracking-[0.22em] text-ember uppercase">
                {venue?.name ?? "La Maccanica"} · Canegrate
              </footer>
            </blockquote>
          </div>
        </Reveal>
      </div>

      <div className="mt-16 border-y border-cream/10 bg-cream/[0.02]">
        <Marquee
          items={["BRACE ACCESA", "PANE ARTIGIANALE", "COCKTAIL", "LIVE MUSIC", "BIRRE ARTIGIANALI"]}
          className="text-cream/25"
          slow
          reverse
        />
      </div>
    </section>
  );
}
