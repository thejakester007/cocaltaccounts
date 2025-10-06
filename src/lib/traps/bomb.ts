import type { TrapBombFile } from "@/data/types";

export async function loadTrapBomb(): Promise<TrapBombFile> {
  const res = await fetch("/data/traps/bomb.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load trap_bomb.json");
  return (await res.json()) as TrapBombFile;
}
