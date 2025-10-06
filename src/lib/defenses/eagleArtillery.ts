import type { EagleArtilleryFile } from "@/data/types";

export async function loadEagleArtillery(): Promise<EagleArtilleryFile> {
  const res = await fetch("/data/defenses/eagle_artillery.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load eagle_artillery.json");
  return (await res.json()) as EagleArtilleryFile;
}
