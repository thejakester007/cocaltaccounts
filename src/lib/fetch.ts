// src/lib/fetch.ts
const CACHE = new Map<string, Promise<unknown>>();

export async function loadJson<T>(path: string, label = path): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${label}`);
  return (await res.json()) as T;
}
