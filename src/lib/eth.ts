export function normalizeAddr(addr?: string | null) {
  if (!addr) return null;
  if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) return null;
  return addr.toLowerCase(); // simple normalization; can add checksum later
}

export function hashish(s: string) {
  // tiny non-cryptographic hash just to avoid storing raw IPs
  let h = 0, i, chr;
  if (!s) return "0";
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    h = (h << 5) - h + chr;
    h |= 0;
  }
  return String(h >>> 0);
}
