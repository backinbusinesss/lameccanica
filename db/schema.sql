-- La Maccanica — schema database
-- Esegui con: npm run db:setup
-- Idempotente: puoi rilanciarlo senza perdere dati.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- admin
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text not null,
  name          text not null default 'Admin',
  last_login_at timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists login_attempts (
  id         bigserial primary key,
  ip         text not null default '',
  email      text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_created_idx on login_attempts (created_at desc);

-- ---------------------------------------------------------------- allergeni
create table if not exists allergens (
  code        text primary key,
  name        text not null,
  short_name  text not null,
  emoji       text not null default '•',
  description text not null default '',
  sort_order  int not null default 0
);

insert into allergens (code, name, short_name, emoji, description, sort_order) values
  ('gluten',      'Cereali contenenti glutine', 'Glutine',   '🌾', 'Grano, segale, orzo, avena e derivati.', 1),
  ('crustaceans', 'Crostacei',                  'Crostacei', '🦐', 'Gamberi, granchi, aragoste e derivati.', 2),
  ('eggs',        'Uova',                       'Uova',      '🥚', 'Uova e prodotti a base di uova.', 3),
  ('fish',        'Pesce',                      'Pesce',     '🐟', 'Pesce e prodotti a base di pesce.', 4),
  ('peanuts',     'Arachidi',                   'Arachidi',  '🥜', 'Arachidi e derivati.', 5),
  ('soy',         'Soia',                       'Soia',      '🫘', 'Soia e prodotti a base di soia.', 6),
  ('milk',        'Latte',                      'Latte',     '🥛', 'Latte e prodotti lattiero-caseari (incluso lattosio).', 7),
  ('nuts',        'Frutta a guscio',            'Frutta a guscio', '🌰', 'Mandorle, nocciole, noci, pistacchi, anacardi.', 8),
  ('celery',      'Sedano',                     'Sedano',    '🥬', 'Sedano e derivati.', 9),
  ('mustard',     'Senape',                     'Senape',    '🌭', 'Senape e prodotti a base di senape.', 10),
  ('sesame',      'Sesamo',                     'Sesamo',    '🫓', 'Semi di sesamo e derivati.', 11),
  ('sulphites',   'Solfiti',                    'Solfiti',   '🍷', 'Anidride solforosa e solfiti in concentrazioni superiori a 10 mg/kg.', 12),
  ('lupin',       'Lupini',                     'Lupini',    '🌼', 'Lupini e prodotti a base di lupini.', 13),
  ('molluscs',    'Molluschi',                  'Molluschi', '🦑', 'Vongole, cozze, calamari, polpi e derivati.', 14)
on conflict (code) do update set
  name = excluded.name, short_name = excluded.short_name, emoji = excluded.emoji,
  description = excluded.description, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------- categorie
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  tagline     text not null default '',
  description text not null default '',
  kind        text not null default 'food' check (kind in ('food', 'drink')),
  emoji       text not null default '',
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- piatti
create table if not exists menu_items (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid not null references categories(id) on delete cascade,
  name           text not null,
  description    text not null default '',
  price          numeric(8,2) not null default 0,
  image_url      text not null default '',
  is_available   boolean not null default true,
  is_featured    boolean not null default false,
  is_vegan       boolean not null default false,
  is_vegetarian  boolean not null default false,
  is_gluten_free boolean not null default false,
  is_spicy       boolean not null default false,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists menu_items_category_idx on menu_items (category_id, sort_order);

create table if not exists menu_item_allergens (
  item_id      uuid not null references menu_items(id) on delete cascade,
  allergen_code text not null references allergens(code) on delete cascade,
  primary key (item_id, allergen_code)
);

-- ---------------------------------------------------------------- prenotazioni
create table if not exists reservations (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null default '',
  phone        text not null,
  party_size   int not null check (party_size between 1 and 30),
  date         date not null,
  time         text not null,
  area         text not null default 'sala' check (area in ('sala', 'veranda', 'bancone', 'esterno')),
  occasion     text not null default '',
  notes        text not null default '',
  status       text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  admin_notes  text not null default '',
  source       text not null default 'sito',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists reservations_date_idx on reservations (date, time);
create index if not exists reservations_created_idx on reservations (created_at desc);

create table if not exists closed_dates (
  date   date primary key,
  reason text not null default ''
);

-- ---------------------------------------------------------------- orari
create table if not exists opening_hours (
  day_of_week  int primary key check (day_of_week between 0 and 6),
  label        text not null,
  lunch_open   text,
  lunch_close  text,
  dinner_open  text,
  dinner_close text,
  is_closed    boolean not null default false
);

insert into opening_hours (day_of_week, label, lunch_open, lunch_close, dinner_open, dinner_close, is_closed) values
  (1, 'Lunedì',    '12:00', '14:30', null, null, false),
  (2, 'Martedì',   '12:00', '14:30', null, null, false),
  (3, 'Mercoledì', '12:00', '14:30', '18:00', '00:00', false),
  (4, 'Giovedì',   '12:00', '14:30', '18:00', '00:00', false),
  (5, 'Venerdì',   '12:00', '14:30', '18:00', '02:30', false),
  (6, 'Sabato',    null, null, '18:00', '02:30', false),
  (0, 'Domenica',  null, null, '18:00', '00:00', false)
on conflict (day_of_week) do nothing;

-- ---------------------------------------------------------------- eventi
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  subtitle     text not null default '',
  description  text not null default '',
  image_url    text not null default '',
  event_date   date,
  event_time   text not null default '',
  badge        text not null default '',
  cta_label    text not null default 'Prenota',
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------- promo
create table if not exists promos (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null default '',
  badge        text not null default '',
  day_of_week  int,
  image_url    text not null default '',
  is_active    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------- gallery
create table if not exists gallery_images (
  id           uuid primary key default gen_random_uuid(),
  url          text not null,
  caption      text not null default '',
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------- settings
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- newsletter
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- seed
insert into categories (slug, name, tagline, description, kind, emoji, sort_order) values
  ('burgers',   'Le Burger',        'Macinato di manzo, pane artigianale, fuoco vero', 'Il cuore della Maccanica: burger costruiti strato per strato, con carne selezionata e pane tostato al burro.', 'food', '🍔', 1),
  ('fritti',    'Fritti & Sharing', 'Da dividere (o no)', 'Croccanti fuori, morbidi dentro. Il modo migliore per iniziare la serata.', 'food', '🍟', 2),
  ('primi',     'Primi & Comfort',  'La pasta che consola', 'Ricette italiane con un accento americano, cottura al punto giusto.', 'food', '🍝', 3),
  ('secondi',   'Dal Fuoco',        'Griglia, brace, carattere', 'Tagli e secondi cotti alla brace, serviti con contorni generosi.', 'food', '🔥', 4),
  ('dolci',     'Dolci',            'Il finale che merita', 'Dessert fatti in casa, da condividere o difendere con i denti.', 'food', '🍰', 5),
  ('cocktail',  'Cocktail',         'Mixology da dopo lavoro', 'Classici ben fatti e signature della casa, dietro al bancone fino a tardi.', 'drink', '🍸', 6),
  ('birre',     'Birre',            'Alla spina, in bottiglia, in lattina', 'Selezione di artigianali italiane ed europee, sempre in rotazione.', 'drink', '🍺', 7),
  ('vini',      'Vini & Bollicine', 'Carta corta, scelta giusta', 'Etichette indipendenti, bollicine per brindare, rossi da brace.', 'drink', '🍷', 8)
on conflict (slug) do nothing;

insert into promos (title, description, badge, day_of_week, sort_order) values
  ('Bacon Cheese 3x2', 'Ogni lunedì il nostro Bacon Cheese Burger in offerta: ne ordini tre, ne paghi due.', 'Lunedì', 1, 1),
  ('Fuori Tutto', 'Cocktail a 5€, birra chiara 3,5€, amari 2,5€. Il mercoledì che aspettavi.', 'Mercoledì', 3, 2),
  ('Beer Thursday', 'Ogni giovedì una birra artigianale diversa dalle 17:00. Scopri la rotazione.', 'Giovedì', 4, 3),
  ('Bimbi gratis', 'Tutti i sabati a pranzo il menù bimbo è gratis per i bambini sotto i 10 anni.', 'Sabato', 6, 4)
on conflict do nothing;

insert into events (title, subtitle, description, image_url, event_date, event_time, badge, cta_label, sort_order) values
  ('Rugby, Music & Love', 'Il sabato sera alla Maccanica', 'Live music, DJ set e cocktail bar. La partita finisce, la serata comincia.', '/assets/img/live.webp', null, '22:00', 'Ogni sabato', 'Prenota il tuo tavolo', 1),
  ('Cene aziendali', 'Natale, team building, compleanni', 'Menu dedicati, spazi riservati e un service che non fa rimpiangere la sala riunioni.', '/assets/img/event.webp', null, 'Su prenotazione', 'Su misura', 'Richiedi un preventivo', 2)
on conflict do nothing;

insert into site_settings (key, value) values
  ('venue', '{
    "name": "La Maccanica",
    "tagline": "Burger, cocktail & live music",
    "claim": "C’è sempre un buon motivo per vivere la Maccanica.",
    "address": "Via Tagliamento 16A, 20039 Canegrate (MI)",
    "phone": "0331 055605",
    "phoneAlt": "379 228 4180",
    "email": "info@lamaccanica.it",
    "whatsapp": "393914895605",
    "instagram": "https://www.instagram.com/lameccanica/",
    "facebook": "https://www.facebook.com/arealameccanicanerviano",
    "maps": "https://maps.google.com/?q=Via+Tagliamento+16A+Canegrate",
    "coperto": "2,00 €",
    "paymentNote": "Carte di credito, Bancomat, Apple Pay e Satispay. Non si effettuano conti separati."
  }'::jsonb),
  ('hero', '{
    "kicker": "Canegrate · dal 2015",
    "title": "Carne vera. Fuoco vero. Notte vera.",
    "subtitle": "Burger artigianali, cocktail firmati e live music fino a tardi. La Maccanica è il posto dove la cena diventa serata.",
    "primaryCta": "Prenota un tavolo",
    "secondaryCta": "Scopri il menu",
    "image": "/assets/img/hero-burger.webp",
    "marquee": ["BURGER", "COCKTAIL", "LIVE MUSIC", "DJ SET", "BRACE", "BIRRE ARTIGIANALI"]
  }'::jsonb),
  ('reservation', '{
    "notice": "Per gruppi superiori a 10 persone scrivici su WhatsApp: costruiamo insieme la serata.",
    "slotMinutes": 30,
    "lastSeating": "22:30",
    "maxParty": 10
  }'::jsonb),
  ('seo', '{
    "title": "La Maccanica — Burger, cocktail e live music a Canegrate",
    "description": "Ristorante e hamburgeria a Canegrate (MI). Burger artigianali, cocktail, birre artigianali e live music. Prenota online il tuo tavolo."
  }'::jsonb)
on conflict (key) do nothing;

insert into gallery_images (url, caption, sort_order) values
  ('/assets/img/interior.webp', 'La sala', 1),
  ('/assets/img/bar.webp', 'Il bancone', 2),
  ('/assets/img/burger-double.webp', 'Double stack', 3),
  ('/assets/img/cocktail.webp', 'Signature cocktail', 4),
  ('/assets/img/live.webp', 'Live music', 5),
  ('/assets/img/fries.webp', 'Fritti', 6)
on conflict do nothing;
