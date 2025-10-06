import type { TrapGigaBombFile } from "@/data/types";

export async function loadGigaBomb(): Promise<TrapGigaBombFile> {
  const res = await fetch("/data/traps/giga_bomb.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load giga_bomb.json");
  return (await res.json()) as TrapGigaBombFile;
}
