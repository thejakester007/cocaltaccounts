import type { RicochetCannonFile } from "@/data/types";

export async function loadRicochetCannon(): Promise<RicochetCannonFile> {
  const res = await fetch("/data/defenses/ricochet_cannon.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load ricochet_cannon.json");
  return (await res.json()) as RicochetCannonFile;
}
