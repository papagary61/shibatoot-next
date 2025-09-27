export function weekStartUtc(d = new Date()) {
  // “weekly” = Saturday 00:00 UTC like we discussed; tweak easily
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // 6 = Saturday (Sun=0..Sat=6)
  const day = dt.getUTCDay();
  const diff = (day + 1) % 7; // move back to Saturday
  dt.setUTCDate(dt.getUTCDate() - diff);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
}
