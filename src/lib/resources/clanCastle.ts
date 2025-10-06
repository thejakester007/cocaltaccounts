// src/lib/clanCastle.ts
import type { ClanCastleFile } from "@/data/types";

export async function loadClanCastle(): Promise<ClanCastleFile> {
  const res = await fetch("/data/resources/clan_castle.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load clan_castle.json");
  return (await res.json()) as ClanCastleFile;
}
