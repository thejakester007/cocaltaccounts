import type { StructuresFile, StructureDef, StructureCategory, CategoryGroups } from "@/data/types";

/** Normalize a category string to our canonical union, else "other". */
function normalizeCategory(raw?: string): StructureCategory {
  const s = (raw ?? "").toLowerCase();
  if (s.includes("army")) return "army";
  if (s.includes("resource")) return "resources";
  if (s.includes("defense")) return "defenses";
  if (s.includes("trap")) return "traps";
  return "others";
}

/** Try to infer a category when StructureDef.category is absent. */
function inferCategory(s: StructureDef): StructureCategory {
  // 1) explicit category wins
  if (s.category) return s.category;

  // 2) path/schema hints
  const fromPath = normalizeCategory(s.pathHint);
  if (fromPath !== "others") return fromPath;

  const fromSchema = normalizeCategory(s.schemaHint);
  if (fromSchema !== "others") return fromSchema;

  // 3) fallbacks by id heuristics (lightweight, extend as you add more)
  const id = s.id.toLowerCase();
  if (/(barracks|army|camp|laboratory|workshop|spell|pet|hero|dark)/.test(id)) return "army";
  if (/(storage|collector|clan|castle|mine|drill)/.test(id)) return "resources";
  if (/(tower|cannon|xbow|inferno|eagle|scatter|monolith|sweeper|tesla)/.test(id)) return "defenses";
  if (/(trap|bomb|mine|tornado|skeleton|spring)/.test(id)) return "traps";

  return "others";
}

/** Group your structures.json into UI-friendly categories. */
export function groupStructuresByCategory(file: StructuresFile): CategoryGroups {
  const groups: CategoryGroups = { army: [], resources: [], defenses: [], traps: [], others: [] };
  for (const s of file.structures) {
    const cat = inferCategory(s);
    groups[cat].push({ ...s, category: cat });
  }
  // Optional: sort by label within each group
  (Object.keys(groups) as StructureCategory[]).forEach((k) => {
    groups[k].sort((a, b) => a.label.localeCompare(b.label));
  });
  return groups;
}
