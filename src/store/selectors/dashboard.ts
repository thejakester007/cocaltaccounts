import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Account, Upgrade } from '@/data/types';

const selectAccountsState = (s: RootState) => s.accounts as unknown;

export type UpgradeEvent = {
  accountId: string;
  accountName: string;
  label: string;
  thLevel?: number;
  name: string;        // upgrade name
  endsAt: Date;
  remainingMs: number;
};

export type NextItem = UpgradeEvent;
export type DueItem = UpgradeEvent;

/** Always return Account[] even if persisted shape was old (array) or new ({ list: Account[] }). */
export const selectAccounts = createSelector([selectAccountsState], (accs: unknown): Account[] => {
  if (Array.isArray(accs)) return accs as Account[]; // old shape
  const maybe = accs as { list?: unknown };
  return Array.isArray(maybe?.list) ? (maybe.list as Account[]) : [];
});

export const selectTotalAccounts = createSelector([selectAccounts], (list) => list.length);

export const selectActiveUpgrades = createSelector([selectAccounts], (list) =>
  list.filter((a) => !!a.activeUpgrade).length
);

export const selectBuildersDistribution = createSelector([selectAccounts], (list) => {
  const dist = [0, 0, 0, 0, 0, 0];
  for (const a of list) {
    const n = typeof a.buildersCount === 'number' ? a.buildersCount : 0;
    const idx = Math.max(0, Math.min(5, n));
    dist[idx] += 1;
  }
  return dist;
});

export const selectWarParticipants = createSelector([selectAccounts], (list) =>
  list.filter((a) => !!a.inWar).length
);

/** Next completion (single soonest) — returns rich UpgradeEvent */
export const selectNextCompletion = createSelector([selectAccounts], (list): NextItem | null => {
  const now = Date.now();

  type WithUp = { acc: Account; up: Account['activeUpgrade'] };
  const withUp: WithUp[] = list.map((acc) => ({ acc, up: acc.activeUpgrade ?? null }));

  const withEnds = withUp.filter(
    (x: WithUp): x is { acc: Account; up: NonNullable<Upgrade> & { endsAtIso: string } } =>
      !!x.up && typeof x.up.endsAtIso === 'string'
  );

  const upcoming: UpgradeEvent[] = withEnds
    .map(({ acc, up }) => {
      const endsAt = new Date(up.endsAtIso);
      return {
        accountId: acc.id,
        accountName: acc.label,
        label: acc.label,
        thLevel: typeof acc.level === 'number' ? acc.level : 0,
        name: up.name,
        endsAt,
        remainingMs: endsAt.getTime() - now,
      };
    })
    .filter((x) => !Number.isNaN(x.endsAt.getTime()) && x.remainingMs > 0)
    .sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime());

  return upcoming[0] || null;
});

/** Due soon (window) — returns array of UpgradeEvent */
export const selectDueSoon = (hours = 24) =>
  createSelector([selectAccounts], (list: Account[]): DueItem[] => {
    const now = Date.now();
    const max = now + hours * 3600 * 1000;

    type WithUp = { acc: Account; up: Account['activeUpgrade'] };
    const withUp: WithUp[] = list.map((acc) => ({ acc, up: acc.activeUpgrade ?? null }));

    const withEnds = withUp.filter(
      (x: WithUp): x is { acc: Account; up: NonNullable<Upgrade> & { endsAtIso: string } } =>
        !!x.up && typeof x.up.endsAtIso === 'string'
    );

    return withEnds
      .map(({ acc, up }) => {
        const endsAt = new Date(up.endsAtIso);
        return {
          accountId: acc.id,
          accountName: acc.label,
          label: acc.label,
          thLevel: typeof acc.level === 'number' ? acc.level : 0,
          name: up.name,
          endsAt,
          remainingMs: endsAt.getTime() - now,
        } as UpgradeEvent;
      })
      .filter(
        (x) =>
          !Number.isNaN(x.endsAt.getTime()) &&
          x.remainingMs >= 0 &&
          x.endsAt.getTime() <= max
      )
      .sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime());
  });

// Aliases to match existing imports
export const selectAccountsList = selectAccounts;
export const selectBuildersDist = selectBuildersDistribution;
export const selectActiveThWithUpgrades = selectActiveUpgrades;
