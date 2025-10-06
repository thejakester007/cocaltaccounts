import type { TrapSeekingAirMineFile } from "@/data/types";

export async function loadSeekingAirMine(): Promise<TrapSeekingAirMineFile> {
  const res = await fetch("/data/traps/seeking_air_mine.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load seeking_air_mine.json");
  return (await res.json()) as TrapSeekingAirMineFile;
}