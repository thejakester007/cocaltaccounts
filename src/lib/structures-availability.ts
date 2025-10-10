// src/lib/structures-availability.ts
type HasLevelAndTH = { level: number; thRequired: number };

/** Highest level you can reach at this TH, derived from JSON. */
export function maxLevelForTH<T extends HasLevelAndTH>(levels: T[], th: number): number | null {
  let max: number | null = null;
  for (const l of levels) {
    if (l.thRequired <= th) {
      if (max === null || l.level > max) max = l.level;
    }
  }
  return max;
}

export function countForTH(
  availability: { th: number; count: number }[] | undefined,
  th: number
): number | null {
  if (!availability) return null;
  const row = availability.find(a => a.th === th);
  return row ? row.count : null;
}
