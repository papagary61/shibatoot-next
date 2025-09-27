// Week = Saturday 00:00 UTC .. Friday 23:59:59.999 UTC (matches your Winner.weekStart note)
export function weekStartUTC(d = new Date()): Date {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // JS: getUTCDay() => 0=Sun,6=Sat. We want last Saturday 00:00 UTC.
  const day = dt.getUTCDay();
  const diff = (day + 1) % 7; // Sat->0, Sun->1, Mon->2, ...
  dt.setUTCDate(dt.getUTCDate() - diff);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
}

export function nextWeekStartUTC(from = new Date()): Date {
  const start = weekStartUTC(from);
  const next = new Date(start);
  next.setUTCDate(next.getUTCDate() + 7);
  return next;
}
