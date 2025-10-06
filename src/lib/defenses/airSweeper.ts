import type { AirSweeperFile } from "@/data/types";

export async function loadAirSweeper(): Promise<AirSweeperFile> {
  const res = await fetch("/data/defenses/air_sweeper.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load air_sweeper.json");
  return (await res.json()) as AirSweeperFile;
}
