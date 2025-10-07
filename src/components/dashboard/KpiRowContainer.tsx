"use client";

import React, { useMemo } from "react";
import KpiRow from "./KpiRow";
import { useAppSelector } from "@/store";
import {
  selectBuildersDist,            // number[]: [count0, count1, ..., count5]
  selectActiveThWithUpgrades,    // number: active accounts with an upgrade
  selectNextCompletion,          // UpgradeEvent | null
  selectAccountsList,            // Account[]
} from "@/store/selectors/dashboard";

type BuildersBucket = { builders: number; accounts: number };

const KpiRowContainer: React.FC = () => {
  // base data
  const accounts = useAppSelector(selectAccountsList);
  const totalAccounts = accounts.length;

  // builders distribution -> convert number[] to BuildersBucket[]
  const rawDist = useAppSelector(selectBuildersDist);
  const buildersDist: BuildersBucket[] = useMemo(
    () =>
      rawDist
        .map((accounts, builders) => ({ builders, accounts }))
        .filter((b) => b.accounts > 0)
        .sort((a, b) => b.builders - a.builders || b.accounts - a.accounts),
    [rawDist]
  );

  // upgrades activity
  const active = useAppSelector(selectActiveThWithUpgrades);
  const totalThCount = useMemo(
    () => accounts.filter((a) => typeof a.level === "number").length,
    [accounts]
  );

  // next completion (may be null if no upgrades)
  const next = useAppSelector(selectNextCompletion);

  // war participants not tracked yet
  const warParticipants = 0;

  return (
    <KpiRow
      totalAccounts={totalAccounts}
      buildersDist={buildersDist}
      warParticipants={warParticipants}
      warTotal={totalAccounts}
      warTitle="In war right now"
      activeThWithUpgrades={active}
      totalThCount={totalThCount}
      activityTitle="Builder activity"
      nextCompletion={
        next ? {
          accountName: next.accountName,
          thLevel: next.thLevel ?? 0,
          label: next.label,
          remainingMs: next.remainingMs,
        } : undefined
      }
    />
  );
};

export default KpiRowContainer;
