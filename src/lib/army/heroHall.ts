import type { HeroHallFile } from "@/data/types";

export async function loadHeroHall(): Promise<HeroHallFile> {
  const res = await fetch("/data/army/hero_hall.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load hero_hall.json");
  return (await res.json()) as HeroHallFile;
}
