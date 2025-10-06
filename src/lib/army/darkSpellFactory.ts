import type { DarkSpellFactoryFile } from "@/data/types";

export async function loadDarkSpellFactory(): Promise<DarkSpellFactoryFile> {
  const res = await fetch("/data/army/dark_spell_factory.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load dark_spell_factory.json");
  return (await res.json()) as DarkSpellFactoryFile;
}
