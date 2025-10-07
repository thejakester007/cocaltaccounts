"use client";

import React, { useMemo } from "react";
import KpiRow from "./KpiRow";
import { useAppSelector } from "@/store";
import {
  selectBuildersDist,
  selectActiveThWithUpgrades,
  selectNextCompletion,
  selectAccountsList,
} from "@/store/selectors/dashboard";

type BuildersBucket = { builders: number; accounts: number };
const buildBuildersDist = (arr: number[]): BuildersBucket[] => {
  const map = new Map<number, number>();
  for (const n of arr) map.set(n, (map.get(n) ?? 0) + 1);
  return [...map.entries()]
    .map(([builders, accounts]) => ({ builders, accounts }))
    .sort((a, b) => b.builders - a.builders || b.accounts - a.accounts);
};

const KpiRowContainer: React.FC = () => {
  const accounts = useAppSelector(selectAccountsList);
  const totalAccounts = accounts.length;

  const buildersDist = useMemo(
    () => buildBuildersDist(accounts.map(a => Number((a as any).buildersCount ?? 0))),
    [accounts]
  );

  const { active, total } = useAppSelector(selectActiveThWithUpgrades); // active THs with upgrades, total THs
  const next = useAppSelector(selectNextCompletion); // may be undefined until you add upgrades

  // war participants not in store yet → show 0 / totalAccounts for now
  const warParticipants = 0;

  return (
    <KpiRow
      totalAccounts={totalAccounts}
      buildersDist={buildersDist}
      warParticipants={warParticipants}
      warTotal={totalAccounts}
      warTitle="In war right now"
      activeThWithUpgrades={active}
      totalThCount={total}
      activityTitle="Builder activity"
      nextCompletion={
        next && {
          accountName: next.accountName,
          thLevel: next.thLevel,
          label: next.label,
          remainingMs: next.remainingMs,
        }
      }
    />
  );
};

export default KpiRowContainer;