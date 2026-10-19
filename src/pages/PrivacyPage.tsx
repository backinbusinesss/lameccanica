import { Link } from "react-router-dom";
import { useContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export function PrivacyPage() {
  const { content } = useContent();
  const venue = content?.settings.venue;

  return (
    <div className="pt-28 pb-20">
      <div className="shell-tight">
        <Reveal>
          <span className="eyebrow">Informativa</span>
          <h1 className="mt-4 text-[clamp(2.4rem,5.4vw,4rem)]">Privacy & cookie</h1>
          <p className="mt-4 text-[0.9rem] text-dim">
            Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
          </p>
        </Reveal>

        <div className="mt-10 space-y-8 text-[0.9rem] leading-relaxed text-cream/75">
          <section>
            <h2 className="font-display text-2xl text-cream">Titolare del trattamento</h2>
            <p className="mt-2">
              {venue?.name ?? "La Meccanica"} — {venue?.address ?? "Via Tagliamento 16A, Canegrate (MI)"}.
              Contatti: {venue?.email ?? "info@arealameccanica.com"} · {venue?.phone ?? "0331 055605"}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream">Dati raccolti</h2>
            <p className="mt-2">
              Raccogliamo i dati che ci fornisci volontariamente tramite il modulo di prenotazione
              (nome, telefono, email facoltativa, numero di persone, data, orario, note su allergie
              o richieste) e tramite l’iscrizione alla newsletter (indirizzo email).
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream">Finalità e base giuridica</h2>
            <p className="mt-2">
              I dati di prenotazione sono trattati per gestire la richiesta e organizzare il
              servizio (esecuzione di un contratto o misure precontrattuali). I dati relativi ad
              allergie e intolleranze sono trattati esclusivamente per garantire la sicurezza
              alimentare e sono comunicati alla cucina. L’iscrizione alla newsletter si basa sul
              tuo consenso, revocabile in qualsiasi momento.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream">Conservazione</h2>
            <p className="mt-2">
              Le prenotazioni sono conservate per il tempo necessario alla gestione del servizio e
              agli obblighi amministrativi. I dati newsletter sono conservati fino alla
              disiscrizione.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream">Cookie</h2>
            <p className="mt-2">
              Il sito utilizza cookie tecnici necessari al funzionamento e alla sicurezza dell’area
              riservata. Non utilizziamo cookie pubblicitari di profilazione. Le mappe e i font
              esterni possono comportare connessioni a servizi di terze parti.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream">I tuoi diritti</h2>
            <p className="mt-2">
              Puoi chiedere accesso, rettifica, cancellazione, limitazione o portabilità dei dati,
              oppure opporti al trattamento, scrivendo a {venue?.email ?? "info@arealameccanica.com"}.
              Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati
              personali.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-cream">Allergeni</h2>
            <p className="mt-2">
              Le informazioni sugli allergeni sono fornite secondo il Regolamento UE 1169/2011.
              Le preparazioni avvengono in una cucina condivisa: non possiamo escludere
              contaminazioni crociate. Segnala sempre allergie e intolleranze al personale prima
              dell’ordinazione.
            </p>
          </section>
        </div>

        <Link to="/" className="btn btn-ghost btn-sm mt-10">
          ← Torna alla home
        </Link>
      </div>
    </div>
  );
}
