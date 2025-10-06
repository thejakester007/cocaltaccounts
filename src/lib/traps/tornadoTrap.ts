import type { TrapTornadoTrapFile } from "@/data/types";

export async function loadTornadoTrap(): Promise<TrapTornadoTrapFile> {
  const res = await fetch("/data/traps/tornado_trap.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load tornado_trap.json");
  return (await res.json()) as TrapTornadoTrapFile;
}
