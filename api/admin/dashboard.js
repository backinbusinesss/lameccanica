import { db } from "../_lib/db.js";
import { json, error, cors, allow } from "../_lib/http.js";
import { requireAdmin } from "../_lib/auth.js";

/** Dashboard: numeri chiave + prenotazioni di oggi. */
export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (!requireAdmin(req, res, json)) return;
  if (allow(req, res, ["GET"])) return;

  try {
    const sql = db();
    const [today, upcoming, stats, top, newsletter] = await Promise.all([
      sql`
        select id, name, phone, party_size, date::text as date, time, area, status, notes, occasion
        from reservations
        where date = current_date and status in ('pending', 'confirmed')
        order by time asc
      `,
      sql`
        select id, name, phone, party_size, date::text as date, time, area, status
        from reservations
        where date > current_date and status in ('pending', 'confirmed')
        order by date asc, time asc limit 8
      `,
      sql`
        select
          count(*) filter (where date = current_date)::int as today_count,
          coalesce(sum(party_size) filter (where date = current_date and status in ('pending','confirmed')), 0)::int as today_guests,
          count(*) filter (where status = 'pending' and date >= current_date)::int as pending,
          count(*) filter (where date >= date_trunc('month', current_date))::int as month_count
        from reservations
      `,
      sql`
        select i.name, c.name as category, count(*)::int as count
        from menu_items i join categories c on c.id = i.category_id
        group by i.name, c.name order by count desc limit 5
      `,
      sql`select count(*)::int as count from newsletter_subscribers`,
    ]);

    return json(req, res, 200, {
      today: today.map((r) => ({
        id: r.id, name: r.name, phone: r.phone, partySize: r.party_size,
        time: r.time, area: r.area, status: r.status, notes: r.notes, occasion: r.occasion,
      })),
      upcoming: upcoming.map((r) => ({
        id: r.id, name: r.name, phone: r.phone, partySize: r.party_size,
        date: r.date, time: r.time, area: r.area, status: r.status,
      })),
      stats: {
        ...stats[0],
        newsletter: newsletter[0].count,
      },
      topItems: top,
    });
  } catch (err) {
    console.error("dashboard error", err);
    return error(req, res, 500, "Impossibile caricare la dashboard.");
  }
}
