// src/lib/fireSpitter.ts
import type { FireSpitterFile } from "@/data/types";

export async function loadFireSpitter(): Promise<FireSpitterFile> {
  const res = await fetch("/data/defenses/fire_spitter.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load fire_spitter.json");
  return (await res.json()) as FireSpitterFile;
}
