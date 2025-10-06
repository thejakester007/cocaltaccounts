import type { SpellFactoryFile } from "@/data/types";

export async function loadSpellFactory(): Promise<SpellFactoryFile> {
  const res = await fetch("/data/army/spell_factory.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load spell_factory.json");
  return (await res.json()) as SpellFactoryFile;
}
