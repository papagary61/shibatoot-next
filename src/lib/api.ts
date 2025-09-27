export async function api<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const admin = process.env.NEXT_PUBLIC_ADMIN_WALLET ?? '';
  const headers = new Headers(init.headers ?? {});
  if (admin) headers.set('x-wallet-address', admin); // TEMP admin gate
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
