import type { AirDefenseFile } from "@/data/types";

export async function loadAirDefense(): Promise<AirDefenseFile> {
  const res = await fetch("/data/defenses/air_defense.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load air_defense.json");
  return (await res.json()) as AirDefenseFile;
}
