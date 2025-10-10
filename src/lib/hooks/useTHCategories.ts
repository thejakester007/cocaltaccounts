"use client";

import React from "react";
import { buildCategoriesForTH, type TownHallCategories } from "@/lib/categories";

export function useTHCategories(th?: number | null) {
  const [cats, setCats] = React.useState<TownHallCategories | null>(null);

  React.useEffect(() => {
    if (!th) {
      setCats(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const data = await buildCategoriesForTH(th);
      if (!cancelled) setCats(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [th]);

  return cats;
}
