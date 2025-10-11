// src/stores/structures/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Account } from '@/data/types';

// —— Types (aligned with your dashboard selectors) ——
export type StructureUpgradeEvent = {
  id: string;          // structure id  `${accountId}:${key}:${slot}`
  accountId: string;
  accountName: string; // pulled from accounts.label
  label: string;       // same as accountName for uniformity
  thLevel?: number;
  name: string;        // structure key, e.g. "cannon"
  slot: number;        // which instance (0..N-1)
  endsAt: Date;
  remainingMs: number;
};

// If you want aliases:
export type NextStructureItem = StructureUpgradeEvent;
export type DueStructureItem = StructureUpgradeEvent;

// —— Local helpers to read both slices with legacy/new shapes ——
type AnyList<T> = { list?: unknown } | unknown;

const selectStructuresState = (s: RootState) => (s as any).structures as AnyList<any>;
const selectAccountsState = (s: RootState) => (s as any).accounts as AnyList<Account>;

const coerceStructures = (raw: AnyList<any>): Array<{
  id: string;
  accountId: string;
  key: string;      // structure key
  slot: number;
  level: number;
  thAtCapture: number;
  upgrading?: boolean;
  endsAt?: number | null;
  note?: string | null;
}> => {
  if (Array.isArray(raw)) return raw as any[];
  const list = Array.isArray((raw as any)?.list) ? ((raw as any).list as any[]) : [];
  return list;
};

const coerceAccounts = (raw: AnyList<Account>): Account[] => {
  if (Array.isArray(raw)) return raw as Account[];
  const list = Array.isArray((raw as any)?.list) ? ((raw as any).list as Account[]) : [];
  return list;
};

// —— Base selectors (lists) ——
export const selectStructures = createSelector([selectStructuresState], coerceStructures);
export const selectAccountsForJoin = createSelector([selectAccountsState], coerceAccounts);

// Map accountId -> {label, level}
const selectAccountMap = createSelector([selectAccountsForJoin], (accs) => {
  const map = new Map<string, { label: string; level?: number }>();
  for (const a of accs) map.set(a.id, { label: a.label, level: typeof a.level === 'number' ? a.level : undefined });
  return map;
});

// —— Simple derivations ——
export const selectStructuresByAccount = (accountId: string) =>
  createSelector([selectStructures], (list) => list.filter((s) => s.accountId === accountId));

export const selectStructuresByAccountAndKey = (accountId: string, key: string) =>
  createSelector([selectStructures], (list) =>
    list
      .filter((s) => s.accountId === accountId && s.key === key)
      .sort((a, b) => a.slot - b.slot)
  );

export const selectTotalUpgradingStructures = createSelector([selectStructures], (list) =>
  list.reduce((n, r) => n + (r.upgrading ? 1 : 0), 0)
);

export const selectUpgradingCountForAccount = (accountId: string) =>
  createSelector([selectStructures], (list) =>
    list.reduce((n, r) => n + (r.accountId === accountId && r.upgrading ? 1 : 0), 0)
  );

// —— Time-window & “next completion” (uniform with your accounts selectors) ——
/** Next structure completion (soonest across all accounts) */
export const selectNextStructureCompletion = createSelector(
  [selectStructures, selectAccountMap],
  (list, accMap): NextStructureItem | null => {
    const now = Date.now();

    const upcoming: StructureUpgradeEvent[] = list
      .filter((s) => s.upgrading && typeof s.endsAt === 'number' && s.endsAt! > now)
      .map((s) => {
        const endsAtMs = Number(s.endsAt);
        const endsAt = new Date(endsAtMs);
        const acc = accMap.get(s.accountId);
        return {
          id: s.id,
          accountId: s.accountId,
          accountName: acc?.label ?? s.accountId,
          label: acc?.label ?? s.accountId, // to mirror your accounts selector
          thLevel: acc?.level,
          name: s.key,
          slot: s.slot,
          endsAt,
          remainingMs: endsAtMs - now,
        } as StructureUpgradeEvent;
      })
      .filter((x) => !Number.isNaN(x.endsAt.getTime()) && x.remainingMs > 0)
      .sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime());

    return upcoming[0] || null;
  }
);

/** Structures due soon within N hours (default 24) */
export const selectStructuresDueSoon = (hours = 24) =>
  createSelector([selectStructures, selectAccountMap], (list, accMap): DueStructureItem[] => {
    const now = Date.now();
    const max = now + hours * 3600 * 1000;

    const due = list
      .filter((s) => s.upgrading && typeof s.endsAt === 'number')
      .map((s) => {
        const endsAtMs = Number(s.endsAt);
        const endsAt = new Date(endsAtMs);
        const acc = accMap.get(s.accountId);
        return {
          id: s.id,
          accountId: s.accountId,
          accountName: acc?.label ?? s.accountId,
          label: acc?.label ?? s.accountId,
          thLevel: acc?.level,
          name: s.key,
          slot: s.slot,
          endsAt,
          remainingMs: endsAtMs - now,
        } as StructureUpgradeEvent;
      })
      .filter(
        (x) =>
          !Number.isNaN(x.endsAt.getTime()) &&
          x.remainingMs >= 0 &&
          x.endsAt.getTime() <= max
      )
      .sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime());

    return due;
  });

// —— Handy aliases to match your naming style (optional) ——
export const selectStructuresList = selectStructures;
export const selectNextStructure = selectNextStructureCompletion;
export const selectDueStructureSoon = selectStructuresDueSoon;
