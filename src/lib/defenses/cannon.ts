import type { CannonFile } from "@/data/types";

export async function loadCannon(): Promise<CannonFile> {
  const res = await fetch("/data/defenses/cannon.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load cannon.json");
  return (await res.json()) as CannonFile;
}
