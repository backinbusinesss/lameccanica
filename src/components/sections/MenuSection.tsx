import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Flame,
  Leaf,
  Search,
  SlidersHorizontal,
  Sparkles,
  WheatOff,
  X,
} from "lucide-react";
import { useContent } from "@/lib/content";
import { cn, euro } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";
import { Reveal, SectionHeading } from "../Reveal";

const FALLBACK = "/assets/img/hero-burger.webp";

export function AllergenBadges({
  codes,
  compact = false,
}: {
  codes: string[];
  compact?: boolean;
}) {
  const { content } = useContent();
  const allergens = content?.allergens ?? [];
  if (!codes.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {codes.map((code) => {
        const allergen = allergens.find((a) => a.code === code);
        if (!allergen) return null;
        return (
          <span
            key={code}
            title={allergen.name}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-cream/15 bg-cream/5 font-semibold text-cream/80",
              compact ? "px-1.5 py-0.5 text-[0.6rem]" : "px-2 py-1 text-[0.66rem]",
            )}
          >
            <span aria-hidden="true">{allergen.emoji}</span>
            {!compact && <span>{allergen.shortName}</span>}
            {compact && <span className="sr-only">{allergen.name}</span>}
          </span>
        );
      })}
    </div>
  );
}

export function DietBadges({ item }: { item: MenuItem }) {
  const flags = [
    item.isVegan && { label: "Vegano", icon: Leaf },
    !item.isVegan && item.isVegetarian && { label: "Veg", icon: Leaf },
    item.isGlutenFree && { label: "Senza glutine", icon: WheatOff },
    item.isSpicy && { label: "Piccante", icon: Flame },
    item.isFeatured && { label: "Signature", icon: Sparkles },
  ].filter(Boolean) as { label: string; icon: typeof Leaf }[];

  if (!flags.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {flags.map(({ label, icon: Icon }) => (
        <span
          key={label}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.08em] uppercase",
            label === "Signature"
              ? "border border-ember/40 bg-ember/12 text-ember"
              : "border border-cream/15 bg-cream/5 text-cream/70",
          )}
        >
          <Icon className="size-2.5" />
          {label}
        </span>
      ))}
    </div>
  );
}

function ItemCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      disabled={!item.isAvailable}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-[22px] border border-cream/10 bg-ink-2/60 text-left transition-all duration-500",
        "hover:-translate-y-1 hover:border-ember/35 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]",
        !item.isAvailable && "opacity-50",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={item.imageUrl || FALLBACK}
          alt={item.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-80" />
        {item.isFeatured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-flame px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.14em] text-white uppercase">
            <Sparkles className="size-2.5" /> Signature
          </span>
        )}
        {!item.isAvailable && (
          <span className="absolute inset-0 grid place-items-center bg-ink/70 text-[0.65rem] font-bold tracking-[0.2em] uppercase">
            Non disponibile oggi
          </span>
        )}
        <span className="absolute right-3 bottom-3 rounded-full bg-ink/80 px-3 py-1 font-display text-sm font-semibold tabular-nums text-cream backdrop-blur-md">
          {euro(item.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.15rem] leading-tight text-cream">{item.name}</h3>
        </div>
        <p className="line-clamp-2 text-[0.8rem] leading-relaxed text-dim">{item.description}</p>
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <DietBadges item={item} />
          {item.allergens.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[0.58rem] font-bold tracking-[0.14em] text-dim/70 uppercase">
                Allergeni
              </span>
              <AllergenBadges codes={item.allergens} compact />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export function MenuSection() {
  const { content } = useContent();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [excluded, setExcluded] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detail, setDetail] = useState<MenuItem | null>(null);

  const categories = content?.categories ?? [];
  const items = content?.items ?? [];
  const allergens = content?.allergens ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (activeCategory !== "all" && item.categoryId !== activeCategory) return false;
      if (excluded.length && item.allergens.some((code) => excluded.includes(code))) return false;
      if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, activeCategory, excluded, query]);

  const grouped = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: filtered.filter((item) => item.categoryId === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, filtered]);

  const toggleAllergen = (code: string) => {
    setExcluded((current) =>
      current.includes(code) ? current.filter((c) => c !== code) : [...current, code],
    );
  };

  const detailAllergens = detail
    ? allergens.filter((a) => detail.allergens.includes(a.code))
    : [];

  return (
    <section id="menu" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Il menu"
          title="Costruito strato"
          italic="per strato"
          description="Carne selezionata, pane artigianale, salse fatte in casa. E per ogni piatto trovi gli allergeni dichiarati: filtra e scegli con tranquillità."
          action={
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={cn("btn btn-ghost btn-sm", filtersOpen && "border-ember/60 text-ember")}
            >
              <SlidersHorizontal className="size-3.5" />
              Filtra allergeni
              {excluded.length > 0 && (
                <span className="grid size-4 place-items-center rounded-full bg-flame text-[0.55rem] text-white">
                  {excluded.length}
                </span>
              )}
            </button>
          }
        />

        {/* search + allergen panel */}
        <div className="mt-9 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-dim" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cerca un piatto, un ingrediente…"
                className="field pl-11"
                aria-label="Cerca nel menu"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-dim hover:text-cream"
                  aria-label="Cancella ricerca"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-[0.68rem] tracking-[0.1em] text-dim uppercase">
              <span className="tabular-nums">{filtered.length}</span> piatti
            </div>
          </div>

          <div
            className={cn(
              "grid overflow-hidden rounded-2xl border border-cream/10 bg-ink-2/50 transition-all duration-500",
              filtersOpen ? "max-h-[36rem] opacity-100" : "max-h-0 border-transparent opacity-0",
            )}
          >
            <div className="p-4">
              <div className="flex items-start gap-2 rounded-xl border border-ember/25 bg-ember/8 p-3 text-[0.72rem] leading-relaxed text-cream/75">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-ember" />
                <p>
                  Seleziona gli allergeni che devi <strong>escludere</strong>: i piatti che li
                  contengono verranno nascosti. Per allergie severe avvisa sempre il personale
                  prima di ordinare.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {allergens.map((allergen) => {
                  const active = excluded.includes(allergen.code);
                  return (
                    <button
                      key={allergen.code}
                      onClick={() => toggleAllergen(allergen.code)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold transition-all",
                        active
                          ? "border-flame/70 bg-flame/15 text-flame"
                          : "border-cream/15 bg-cream/5 text-cream/75 hover:border-cream/35",
                      )}
                    >
                      <span aria-hidden="true">{allergen.emoji}</span>
                      {allergen.shortName}
                      {active && <X className="size-3" />}
                    </button>
                  );
                })}
              </div>
              {excluded.length > 0 && (
                <button
                  onClick={() => setExcluded([])}
                  className="mt-4 text-[0.7rem] font-bold tracking-[0.14em] text-ember uppercase hover:text-cream"
                >
                  Azzera filtri
                </button>
              )}
            </div>
          </div>

          {/* category tabs */}
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-[0.7rem] font-bold tracking-[0.1em] uppercase transition-all",
                activeCategory === "all"
                  ? "border-cream bg-cream text-ink"
                  : "border-cream/15 text-cream/65 hover:border-cream/40",
              )}
            >
              Tutto
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-[0.7rem] font-bold tracking-[0.1em] uppercase transition-all",
                  activeCategory === category.id
                    ? "border-cream bg-cream text-ink"
                    : "border-cream/15 text-cream/65 hover:border-cream/40",
                )}
              >
                {category.emoji} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* results */}
        <div className="mt-12 space-y-16">
          {grouped.map(({ category, items: groupItems }) => (
            <div key={category.id} id={`cat-${category.slug}`}>
              <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-cream">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-[0.78rem] tracking-[0.06em] text-dim">{category.tagline}</p>
                </div>
                <span className="text-[0.62rem] font-bold tracking-[0.2em] text-dim/60 uppercase">
                  {groupItems.length} {groupItems.length === 1 ? "piatto" : "piatti"}
                </span>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupItems.map((item, index) => (
                  <Reveal key={item.id} delay={Math.min(index * 45, 260)}>
                    <ItemCard item={item} onOpen={() => setDetail(item)} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          {grouped.length === 0 && (
            <div className="rounded-3xl border border-cream/10 bg-ink-2/50 py-16 text-center">
              <p className="font-display text-2xl">Nessun piatto trovato</p>
              <p className="mt-2 text-sm text-dim">
                Prova a rimuovere qualche filtro o a cercare altro.
              </p>
              <button
                onClick={() => {
                  setExcluded([]);
                  setQuery("");
                  setActiveCategory("all");
                }}
                className="btn btn-ghost btn-sm mt-6"
              >
                Azzera tutto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* detail modal */}
      {detail && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setDetail(null)}
        >
          <div
            className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-cream/12 bg-ink-2 sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-ink/70 text-cream backdrop-blur-md hover:bg-ink"
              aria-label="Chiudi"
            >
              <X className="size-4" />
            </button>
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={detail.imageUrl || FALLBACK}
                alt={detail.name}
                className="size-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-3xl">{detail.name}</h3>
                <span className="shrink-0 font-display text-2xl text-ember">
                  {euro(detail.price)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-dim">{detail.description}</p>
              <div className="mt-5">
                <DietBadges item={detail} />
              </div>

              <div className="mt-7 rounded-2xl border border-cream/10 bg-cream/[0.03] p-4">
                <h4 className="text-[0.62rem] font-bold tracking-[0.2em] text-dim uppercase">
                  Allergeni dichiarati
                </h4>
                {detailAllergens.length ? (
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {detailAllergens.map((allergen) => (
                      <li key={allergen.code} className="flex items-start gap-2 text-[0.78rem]">
                        <span aria-hidden="true">{allergen.emoji}</span>
                        <span>
                          <span className="font-semibold text-cream">{allergen.name}</span>
                          <span className="block text-[0.68rem] text-dim">{allergen.description}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[0.78rem] text-cream/70">
                    Nessun allergene tra i 14 principali dichiarato per questo piatto.
                  </p>
                )}
              </div>

              <p className="mt-5 text-[0.68rem] leading-relaxed text-dim/70">
                Le preparazioni avvengono in una cucina condivisa: segnala sempre intolleranze e
                allergie al personale prima dell’ordinazione.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
