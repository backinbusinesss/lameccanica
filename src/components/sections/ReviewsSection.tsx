import { ArrowUpRight, Star } from "lucide-react";
import { useContent } from "@/lib/content";
import { Reveal } from "../Reveal";
import { Link } from "react-router-dom";

const REVIEWS = [
  {
    name: "Marco T.",
    text: "Il miglior burger della zona, senza discussioni. Il Bacon Cheese è una droga e il personale ti fa sentire a casa.",
    tag: "Burger",
  },
  {
    name: "Giulia R.",
    text: "Siamo venuti per un compleanno, siamo rimasti per il DJ set. Cocktail ottimi e atmosfera pazzesca.",
    tag: "Serata",
  },
  {
    name: "Andrea P.",
    text: "Menu con allergeni chiari, il personale ha gestito la mia intolleranza senza farmi sentire un problema.",
    tag: "Allergie",
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
            <span className="eyebrow">La gente dice</span>
            <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,3.6rem)]">
              4,7 su 5.
              <br />
              <span className="display-italic text-ember">Non lo diciamo noi.</span>
            </h2>
            <div className="mt-5 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-ember text-ember" />
              ))}
              <span className="ml-2 text-[0.72rem] tracking-[0.1em] text-dim uppercase">
                2.400+ recensioni
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-dim">
              Burger, serate e attenzione alle allergie. Ecco cosa ci raccontano più spesso.
            </p>
            <a
              href={venue?.maps}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm mt-6"
            >
              Leggi su Google
              <ArrowUpRight className="size-3.5" />
            </a>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            {REVIEWS.map((review, index) => (
              <Reveal key={review.name} delay={index * 80}>
                <figure className="flex h-full flex-col rounded-[22px] border border-cream/10 bg-ink-2/60 p-5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3 fill-ember text-ember" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[0.85rem] leading-relaxed text-cream/80">
                    “{review.text}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center justify-between border-t border-cream/10 pt-4">
                    <span className="text-[0.78rem] font-semibold">{review.name}</span>
                    <span className="chip">{review.tag}</span>
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
                Prenotazione online in 30 secondi, conferma via telefono.
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
