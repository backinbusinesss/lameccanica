import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/content";
import { Reveal } from "../Reveal";
import { Link } from "react-router-dom";

const HIGHLIGHTS = [
  {
    title: "Burger, davvero",
    text: "Carne selezionata, pane artigianale e cottura alla brace. Il Bacon Cheese 3x2 del lunedì è diventato un rito.",
    tag: "Cucina",
  },
  {
    title: "La serata continua",
    text: "Cocktail bar, DJ set e live music fino a tardi. Qui la cena è solo l'inizio: il bancone resta aperto.",
    tag: "Live",
  },
  {
    title: "Allergie, senza sorprese",
    text: "Quattordici allergeni dichiarati piatto per piatto, consultabili online e filtrabili prima ancora di sederti.",
    tag: "Allergeni",
  },
];

export function ReviewsSection() {
  const { content } = useContent();
  const venue = content?.settings.venue;

  return (
    <section className="relative py-20 md:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow">Perché torni</span>
            <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,3.6rem)]">
              Tre motivi.
              <br />
              <span className="display-italic text-ember">Nessuna formalità.</span>
            </h2>
            <div className="mt-5 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-ember" />
              <span className="text-[0.72rem] tracking-[0.1em] text-dim uppercase">
                Burger · Cocktail · Live
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-dim">
              Dal 2014 a Nerviano, oggi a Canegrate: la stessa idea di serata, in una location nuova.
            </p>
            <a
              href={venue?.maps}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm mt-6"
            >
              Trovaci su Maps
              <ArrowUpRight className="size-3.5" />
            </a>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            {HIGHLIGHTS.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <figure className="flex h-full flex-col rounded-[22px] border border-cream/10 bg-ink-2/60 p-5">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[0.58rem] font-bold tracking-[0.2em] text-ember uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <blockquote className="mt-4 flex-1">
                    <p className="font-display text-[1.15rem] leading-snug text-cream">{item.title}</p>
                    <p className="mt-2 text-[0.82rem] leading-relaxed text-cream/70">{item.text}</p>
                  </blockquote>
                  <figcaption className="mt-5 flex items-center justify-between border-t border-cream/10 pt-4">
                    <span className="text-[0.62rem] font-bold tracking-[0.18em] text-dim uppercase">
                      La Meccanica
                    </span>
                    <span className="chip">{item.tag}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-col items-center gap-4 rounded-[28px] border border-ember/25 bg-gradient-to-br from-ember/12 via-transparent to-transparent px-6 py-10 text-center md:flex-row md:justify-between md:px-12 md:text-left">
            <div>
              <h3 className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)]">
                Stasera hai un posto.
              </h3>
              <p className="mt-2 text-[0.88rem] text-dim">
                Prenotazione online in 30 secondi, conferma via telefono o WhatsApp.
              </p>
            </div>
            <Link to="/prenota" className="btn btn-flame shrink-0">
              Prenota ora
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
