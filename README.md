# La Meccanica

Sito ufficiale de **La Meccanica** — ristorante, hamburgeria e cocktail bar a Canegrate (MI). Burger artigianali, cocktail, birre artigianali e live music.

Frontend React + Vite, API serverless su Vercel, database Postgres su Neon. Include un'area riservata completa per gestire menu, allergeni, prenotazioni e contenuti senza toccare il codice.

**Live:** https://lameccanica.vercel.app
**Admin:** https://lameccanica.vercel.app/admin

---

## Stack

| Area | Tecnologie |
| --- | --- |
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS v4, React Router 7, lucide-react |
| API | Vercel Functions (`/api`), Node runtime |
| Database | Neon Postgres (`@neondatabase/serverless`, driver HTTP) |
| Auth | JWT in cookie `httpOnly` + bcrypt |
| Media | Vercel Blob (upload immagini dall'admin) |
| Deploy | GitHub + Vercel |

---

## Funzionalità

### Sito pubblico
- Hero cinematico con immagini, marquee e scroll reveal.
- Menu dinamico con ricerca, filtro per **14 allergeni UE** (esclusione), categorie e schede piatto.
- Promo settimanali, eventi/live, galleria, recensioni, mappa e orari.
- Percorso di prenotazione in 4 step: data → orario → zona/tavolo → dati, con slot calcolati sugli orari reali e blocco delle date di chiusura.
- Newsletter, pagina privacy, SEO dinamica.

### Area admin (`/admin`)
- **Dashboard**: coperti di oggi, richieste da confermare, prossimi arrivi, statistiche menu/newsletter.
- **Prenotazioni**: filtri per stato, cambio stato, note, eliminazione.
- **Menu & allergeni**: CRUD piatti, categorie, prezzi, disponibilità, allergeni, upload immagine.
- **Contenuti**: promo, eventi, galleria, orari di apertura, giorni di chiusura.
- **Impostazioni**: dati locale, hero, parametri prenotazione, SEO.

---

## Sviluppo locale

```bash
npm install
vercel link          # collega il progetto Vercel
vercel env pull .env.local
npm run db:setup     # crea schema, allergeni, categorie e menu iniziale
vercel dev --listen 3001
```

Il sito sarà su <http://localhost:3001>, l'admin su <http://localhost:3001/admin>.

### Variabili d'ambiente

| Variabile | Descrizione |
| --- | --- |
| `DATABASE_URL` | Connection string Neon (usa quella pooled) |
| `JWT_SECRET` | Segreto per firmare i cookie di sessione |
| `BLOB_STORE_ID` | ID dello store Vercel Blob per gli upload |
| `BLOB_WEBHOOK_PUBLIC_KEY` | Chiave pubblica webhook Blob (opzionale) |

### Script

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Vite dev server (senza API) |
| `npm run build` | Typecheck + build di produzione |
| `npm run typecheck` | Solo TypeScript |
| `npm run db:setup` | Applica `db/schema.sql`, crea l'admin, inserisce il menu |
| `npm run db:seed` | Reinserisce i dati di esempio |

---

## Struttura

```
api/                 funzioni serverless
  _lib/              db, auth, http, rate limit
  admin/             endpoint protetti (contenuti, prenotazioni, dashboard)
  content.js         payload pubblico unico (menu, promo, eventi, orari…)
  reservations.js    creazione + gestione prenotazioni
  upload.js          upload immagini su Vercel Blob
db/schema.sql        schema completo + seed
scripts/             setup, seed, diagnostica
src/
  components/        layout, sezioni pubbliche, UI
  admin/             backoffice (pagine, layout, hook)
  lib/               api client, content provider, tipi, utils
public/assets/img/   immagini del sito
```

---

## API principali

| Metodo | Endpoint | Note |
| --- | --- | --- |
| GET | `/api/content` | Tutto il contenuto pubblico |
| GET | `/api/availability?date=YYYY-MM-DD` | Slot liberi per data |
| POST | `/api/reservations` | Nuova prenotazione (rate limited) |
| POST | `/api/newsletter` | Iscrizione newsletter |
| POST | `/api/auth` | Login admin (`action=login`/`logout`/`me`) |
| GET/POST/PATCH/DELETE | `/api/menu-items` | CRUD piatti (admin) |
| GET/POST/PATCH/DELETE | `/api/categories` | CRUD categorie (admin) |
| GET/PATCH/DELETE | `/api/admin/reservations` | Gestione prenotazioni |
| GET/POST/PATCH/DELETE | `/api/admin/content` | Promo, eventi, galleria, orari, chiusure, impostazioni |
| GET | `/api/admin/dashboard` | Metriche dashboard |
| POST | `/api/upload` | Upload immagine (admin) |

---

## Deploy

Il deploy di produzione è automatico: ogni push su `main` esegue il workflow
`.github/workflows/deploy.yml` (GitHub Actions → `vercel build` + `vercel deploy --prod`).

In alternativa, da locale:

```bash
vercel --prod
```

Il progetto è già collegato a Neon e Vercel Blob. Dopo il deploy verifica:

```bash
curl https://lameccanica.vercel.app/api/content
```

### Credenziali admin

- **Email:** `admin@arealameccanica.com`
- **Password:** `Meccanica2026!`

> Il menu iniziale (35 piatti) è un contenuto dimostrativo: puoi modificarlo, aggiungerne o
> rimuoverne dall'area **Menu & allergeni** senza toccare il codice.

---

## Sicurezza

- Password admin hashata con bcrypt (12 round).
- Sessione JWT in cookie `httpOnly`, `secure`, `sameSite=lax`, scadenza 7 giorni.
- Rate limiting su login e prenotazioni (tabella `login_attempts`).
- Tutti gli endpoint `/api/admin/*` e le mutazioni richiedono sessione valida.

> **Nota:** cambia subito la password di default `admin@arealameccanica.com` / `Meccanica2026!` dal database o tramite lo script di setup, prima di condividere l'URL pubblico.
