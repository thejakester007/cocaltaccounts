import type { HiddenTeslaFile } from "@/data/types";

export async function loadHiddenTesla(): Promise<HiddenTeslaFile> {
  const res = await fetch("/data/defenses/hidden_tesla.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load hidden_tesla.json");
  return (await res.json()) as HiddenTeslaFile;
}
