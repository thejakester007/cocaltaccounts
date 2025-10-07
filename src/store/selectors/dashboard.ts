// src/store/selectors/dashboard.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { buildersDistribution } from "@/lib/stats";
import { formatMsShort } from "@/lib/duration";

export const selectAccountsList = (s: RootState) => s.accounts.accounts;

// Optional until you add upgrades slice
type MaybeUpgrades = RootState & {
  upgrades?: {
    items: Array<{
      id: string; accountId: string; kind: string; buildingName?: string;
      startedAt: string; endsAt: string;
    }>
  }
};

export const selectUpgradesList = (s: MaybeUpgrades) => s.upgrades?.items ?? [];

export const selectBuildersDist = createSelector(
  [selectAccountsList],
  (accounts) => buildersDistribution(accounts.map(a => Number(a.buildersCount ?? 0)))
);

export const selectActiveThWithUpgrades = createSelector(
  [selectAccountsList, selectUpgradesList],
  (accounts, upgrades) => {
    const now = Date.now();
    const activeThIds = new Set(
      upgrades.filter(u => new Date(u.endsAt).getTime() > now).map(u => u.accountId)
    );
    return { active: activeThIds.size, total: accounts.length };
  }
);

export const selectNextCompletion = createSelector(
  [selectUpgradesList, selectAccountsList],
  (upgrades, accounts) => {
    const now = Date.now();
    const next = upgrades
      .filter(u => new Date(u.endsAt).getTime() > now)
      .sort((a, b) => +new Date(a.endsAt) - +new Date(b.endsAt))[0];

    if (!next) return undefined;

    const acc = accounts.find(a => a.id === next.accountId);
    if (!acc) return undefined;

    const remainingMs = +new Date(next.endsAt) - now;
    return {
      accountName: acc.name,
      thLevel: acc.level,
      label: next.buildingName ?? next.kind,
      remainingMs,
      remainingText: formatMsShort(remainingMs),
    };
  }
);