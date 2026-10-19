import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const text = readFileSync(path.join(root, file), "utf8");
      for (const line of text.split(/\r?\n/)) {
        const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
        if (!match) continue;
        const [, key, raw] = match;
        if (!process.env[key]) process.env[key] = raw.replace(/^["']|["']$/g, "");
      }
    } catch {
      /* file opzionale */
    }
  }
}

loadEnv();

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!url) {
  console.error("DATABASE_URL mancante. Esegui: vercel env pull .env.local");
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(path.join(root, "db", "schema.sql"), "utf8");

console.log("→ Applico lo schema…");
// Il driver HTTP non accetta più statement in un'unica prepared query:
// rimuovo i commenti, divido il file in comandi e li eseguo in ordine.
const clean = schema
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");
const statements = clean
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(`${statement};`);
}
console.log(`✓ Schema pronto (${statements.length} comandi)`);

// ---------------------------------------------------------------- admin
const email = process.env.ADMIN_EMAIL || "admin@arealameccanica.com";
const password = process.env.ADMIN_PASSWORD || "Meccanica2026!";
const hash = await bcrypt.hash(password, 12);

await sql`
  insert into admin_users (email, password_hash, name)
  values (${email.toLowerCase()}, ${hash}, 'La Meccanica')
  on conflict (email) do update set password_hash = excluded.password_hash
`;
console.log(`✓ Admin: ${email}`);

// ---------------------------------------------------------------- menu
const menu = [
  {
    category: "burgers",
    items: [
      { name: "La Meccanica", description: "Doppio manzo 200g, cheddar stagionato, bacon croccante, cipolla caramellata, salsa Meccanica, pane brioche.", price: 15.5, featured: true, allergens: ["gluten", "milk", "eggs", "mustard", "sulphites"], image: "/assets/img/hero-burger.webp" },
      { name: "Bacon Cheese", description: "Manzo 180g, doppio cheddar, bacon affumicato, cetriolini, senape e ketchup della casa.", price: 13.5, featured: true, allergens: ["gluten", "milk", "mustard", "sulphites"], image: "/assets/img/burger-bacon.webp" },
      { name: "Double Smash", description: "Due smash patty 90g, formaggio americano, cipolla bianca, salsa speciale, pane tostato al burro.", price: 14.0, allergens: ["gluten", "milk", "eggs", "mustard"], image: "/assets/img/burger-double.webp" },
      { name: "Il Vegetariano", description: "Burger di ceci e barbabietola, avocado, pomodorini confit, maionese vegana, pane multicereali.", price: 13.0, vegetarian: true, vegan: false, allergens: ["gluten", "sesame"], image: "/assets/img/salad.webp" },
      { name: "Pollo Croccante", description: "Pollo fritto in buttermilk, slaw, pickles, maionese al lime e pepe.", price: 13.5, allergens: ["gluten", "milk", "eggs", "mustard"], image: "/assets/img/wings.webp" },
      { name: "Fire & Smoke", description: "Manzo 180g, jalapeños, cheddar affumicato, salsa bbq piccante, anelli di cipolla fritti.", price: 14.5, spicy: true, allergens: ["gluten", "milk", "mustard", "sulphites"], image: "/assets/img/steak.webp" },
    ],
  },
  {
    category: "fritti",
    items: [
      { name: "Patatine Meccanica", description: "Patatine rustiche con rosmarino, sale Maldon e maionese al tartufo.", price: 6.0, allergens: ["eggs", "mustard"], image: "/assets/img/fries.webp" },
      { name: "Chicken Wings 8pz", description: "Alette di pollo glassate, salsa bbq o buffalo, sedano e dip al blue cheese.", price: 10.0, spicy: true, allergens: ["milk", "celery", "mustard"], image: "/assets/img/wings.webp" },
      { name: "Onion Rings", description: "Anelli di cipolla in pastella alla birra, salsa ranch.", price: 6.5, allergens: ["gluten", "milk", "eggs"], image: "/assets/img/fries.webp" },
      { name: "Mac & Cheese Bites", description: "Bocconcini di mac & cheese fritti, salsa al pomodoro affumicato.", price: 8.0, vegetarian: true, allergens: ["gluten", "milk", "eggs"], image: "/assets/img/fries.webp" },
      { name: "Nachos Sharing", description: "Nachos, cheddar fuso, guacamole, pico de gallo, jalapeños. Per due.", price: 12.0, vegetarian: true, spicy: true, allergens: ["milk"], image: "/assets/img/fries.webp" },
    ],
  },
  {
    category: "primi",
    items: [
      { name: "Carbonara della Casa", description: "Spaghettone, guanciale croccante, pecorino romano, tuorlo d'uovo e pepe nero.", price: 13.0, allergens: ["gluten", "eggs", "milk"], image: "/assets/img/pasta.webp" },
      { name: "Amatriciana", description: "Mezze maniche, pomodoro San Marzano, guanciale, pecorino, peperoncino.", price: 12.5, spicy: true, allergens: ["gluten", "milk"], image: "/assets/img/pasta.webp" },
      { name: "Pesto & Burrata", description: "Trofie, pesto genovese, burrata pugliese, pomodorini, pinoli tostati.", price: 13.5, vegetarian: true, allergens: ["gluten", "milk", "nuts"], image: "/assets/img/pasta.webp" },
      { name: "Mac & Cheese", description: "Pasta corta, blend di quattro formaggi, crosta di pane alle erbe.", price: 11.0, vegetarian: true, allergens: ["gluten", "milk"], image: "/assets/img/pasta.webp" },
    ],
  },
  {
    category: "secondi",
    items: [
      { name: "Tagliata 300g", description: "Controfiletto alla brace, rucola, scaglie di grana, riduzione al balsamico.", price: 22.0, allergens: ["milk", "sulphites"], image: "/assets/img/steak.webp" },
      { name: "Ribs BBQ", description: "Costine di maiale marinate 12 ore, glassa bbq, slaw e patate al forno.", price: 18.0, allergens: ["mustard", "sulphites"], image: "/assets/img/steak.webp" },
      { name: "Salmone alla Brace", description: "Filetto di salmone, burro al limone, verdure grigliate.", price: 19.0, glutenFree: true, allergens: ["fish", "milk"], image: "/assets/img/steak.webp" },
      { name: "Caesar Salad", description: "Lattuga romana, pollo grigliato, crostini, parmigiano, dressing Caesar.", price: 12.0, allergens: ["gluten", "milk", "eggs", "fish", "mustard"], image: "/assets/img/salad.webp" },
    ],
  },
  {
    category: "dolci",
    items: [
      { name: "Cheesecake New York", description: "Base biscotto, crema al formaggio, coulis di frutti rossi.", price: 7.0, vegetarian: true, allergens: ["gluten", "milk", "eggs"], image: "/assets/img/dessert.webp" },
      { name: "Brownie & Gelato", description: "Brownie caldo al cioccolato fondente, gelato alla vaniglia, salsa salata al caramello.", price: 7.5, vegetarian: true, allergens: ["gluten", "milk", "eggs", "soy"], image: "/assets/img/dessert.webp" },
      { name: "Tiramisù", description: "Mascarpone, savoiardi, caffè espresso, cacao amaro.", price: 6.5, vegetarian: true, allergens: ["gluten", "milk", "eggs"], image: "/assets/img/dessert.webp" },
    ],
  },
  {
    category: "cocktail",
    items: [
      { name: "Meccanica Sour", description: "Bourbon, limone, sciroppo d'acero, albume, bitter. Il nostro signature.", price: 9.0, featured: true, allergens: ["eggs"], image: "/assets/img/cocktail.webp" },
      { name: "Negroni", description: "Gin, Campari, vermouth rosso. Servito con scorza d'arancia.", price: 8.0, allergens: ["sulphites"], image: "/assets/img/cocktail.webp" },
      { name: "Spritz", description: "Aperol, prosecco, soda, arancia.", price: 6.0, allergens: ["sulphites"], image: "/assets/img/cocktail.webp" },
      { name: "Espresso Martini", description: "Vodka, liquore al caffè, espresso, zucchero.", price: 9.0, image: "/assets/img/cocktail.webp" },
      { name: "Moscow Mule", description: "Vodka, ginger beer, lime, menta.", price: 8.0, image: "/assets/img/cocktail.webp" },
    ],
  },
  {
    category: "birre",
    items: [
      { name: "Birra Chiara alla Spina", description: "Lager italiana, 0,4l. Fresca, secca, facile.", price: 3.5, glutenFree: false, allergens: ["gluten"], image: "/assets/img/beer.webp" },
      { name: "IPA Artigianale", description: "Luppolata, agrumata, 0,33l. Rotazione settimanale.", price: 5.5, featured: true, allergens: ["gluten"], image: "/assets/img/beer.webp" },
      { name: "Weiss", description: "Grano, banana e chiodi di garofano. 0,5l.", price: 5.0, allergens: ["gluten"], image: "/assets/img/beer.webp" },
      { name: "Stout", description: "Caffè, cacao, tostato. 0,33l.", price: 6.0, allergens: ["gluten"], image: "/assets/img/beer.webp" },
    ],
  },
  {
    category: "vini",
    items: [
      { name: "Chianti Classico", description: "Sangiovese, ciliegia, spezie. Calice 0,15l.", price: 5.0, allergens: ["sulphites"], image: "/assets/img/whiskey.webp" },
      { name: "Prosecco DOC", description: "Bollicine secche, mela verde. Calice 0,15l.", price: 4.5, allergens: ["sulphites"], image: "/assets/img/whiskey.webp" },
      { name: "Pinot Grigio", description: "Fresco, minerale. Calice 0,15l.", price: 4.5, allergens: ["sulphites"], image: "/assets/img/whiskey.webp" },
      { name: "Bottiglia Rossa Riserva", description: "Rosso strutturato, 0,75l. Per la brace.", price: 24.0, allergens: ["sulphites"], image: "/assets/img/whiskey.webp" },
    ],
  },
];

console.log("→ Inserisco il menu…");
for (const group of menu) {
  const cat = (
    await sql`select id from categories where slug = ${group.category} limit 1`
  )[0];
  if (!cat) {
    console.warn(`! categoria ${group.category} mancante`);
    continue;
  }

  await sql`delete from menu_items where category_id = ${cat.id}`;

  let order = 0;
  for (const item of group.items) {
    order += 1;
    const rows = await sql`
      insert into menu_items (
        category_id, name, description, price, image_url, is_available, is_featured,
        is_vegan, is_vegetarian, is_gluten_free, is_spicy, sort_order
      ) values (
        ${cat.id}, ${item.name}, ${item.description}, ${item.price}, ${item.image || ""},
        true, ${Boolean(item.featured)}, ${Boolean(item.vegan)}, ${Boolean(item.vegetarian)},
        ${Boolean(item.glutenFree)}, ${Boolean(item.spicy)}, ${order}
      ) returning id
    `;
    for (const code of item.allergens || []) {
      await sql`
        insert into menu_item_allergens (item_id, allergen_code)
        values (${rows[0].id}, ${code}) on conflict do nothing
      `;
    }
  }
}

console.log("✓ Menu inserito");
console.log("\nSetup completato.");
console.log(`Admin: ${email} / ${password}`);
