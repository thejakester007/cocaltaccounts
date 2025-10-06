import type { XBowFile } from "@/data/types";

export async function loadXBow(): Promise<XBowFile> {
  const res = await fetch("/data/defenses/x_bow.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load x_bow.json");
  return (await res.json()) as XBowFile;
}
