import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useContent } from "@/lib/content";
import { Reveal } from "../Reveal";
import { Link } from "react-router-dom";

export function NewsletterSection() {
  const { content } = useContent();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("loading");
    try {
      await api.post("/api/newsletter", { email });
      setState("done");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Iscrizione non riuscita.");
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-cream/12 bg-ink-2">
            <img
              src={content?.gallery[3]?.url ?? "/assets/img/cocktail.webp"}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 size-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
            <div
              aria-hidden="true"
              className="absolute -right-20 -bottom-20 size-80 rounded-full bg-flame/25 blur-[100px]"
            />

            <div className="relative grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-14">
              <div>
                <span className="eyebrow">La lista</span>
                <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)]">
                  Sappi prima
                  <br />
                  <span className="display-italic text-ember">degli altri.</span>
                </h2>
                <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-dim">
                  Nuovi menu, serate live e promo lampo. Una mail al mese, zero spam.
                </p>
              </div>

              <div>
                {state === "done" ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-400 text-ink">
                      <Check className="size-4" />
                    </span>
                    <div>
                      <p className="font-display text-lg">Ci sei.</p>
                      <p className="text-[0.8rem] text-cream/70">
                        Ti scriveremo appena c’è qualcosa che vale la pena.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="la-tua@email.it"
                        className="field flex-1"
                        aria-label="Email per la newsletter"
                      />
                      <button
                        type="submit"
                        disabled={state === "loading"}
                        className="btn btn-flame shrink-0"
                      >
                        {state === "loading" ? "Invio…" : "Iscrivimi"}
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                    {state === "error" && (
                      <p className="text-[0.75rem] text-flame">{message}</p>
                    )}
                    <p className="text-[0.65rem] leading-relaxed text-dim/70">
                      Iscrivendoti accetti la nostra{" "}
                      <Link to="/privacy" className="underline underline-offset-2 hover:text-cream">
                        privacy policy
                      </Link>
                      . Puoi disiscriverti quando vuoi.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
