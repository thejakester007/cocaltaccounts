import type { TrapAirBombFile } from "@/data/types";

export async function loadAirBomb(): Promise<TrapAirBombFile> {
  const res = await fetch("/data/traps/air_bomb.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load air_bomb.json");
  return (await res.json()) as TrapAirBombFile;
}
