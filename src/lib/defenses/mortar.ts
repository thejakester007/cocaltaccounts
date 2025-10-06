import type { MortarFile } from "@/data/types";

export async function loadMortar(): Promise<MortarFile> {
  const res = await fetch("/data/defenses/mortar.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load mortar.json");
  return (await res.json()) as MortarFile;
}
