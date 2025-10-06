import type { TrapGiantBombFile } from "@/data/types";

export async function loadTrapGiantBomb(): Promise<TrapGiantBombFile> {
  const res = await fetch("/data/traps/giant_bomb.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load trap_giant_bomb.json");
  return (await res.json()) as TrapGiantBombFile;
}
