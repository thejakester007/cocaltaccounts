"use client";

import React, { useState, useEffect, useMemo } from "react";
import { RootState } from "@/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import { TownHallRow } from "@/data/types";
import { getTownHallRow } from "@/lib/resources/townHall";
import { parseDurationToMs, formatMsShort } from "@/lib/duration";
import Spinner from "@/components/common/Spinner";
import { Stat, Card, KV } from "@/components/accounts/AccountHelpers";
import TownHallOverviewSection from "@/components/accounts/TownHallOverviewSection";
import AccountContextCards from "@/components/accounts/AccountContextCards";

type Params = { id: string };

const AccountDetailsPage = ({ params }: { params: Promise<Params> }) => {
  const { id } = React.use(params);
  const account = useSelector((s: RootState) => s.accounts.list.find(i => i.id === id));

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [townHallDetails, setTownHallDetails] = useState<TownHallRow | null>(null);
  const [nextTownHallDetails, setNextTownHallDetails] = useState<TownHallRow | null>(null);

  const [{ current, next }, setTH] = useState<{
    current: TownHallRow | null;
    next: TownHallRow | null;
  }>({ current: null, next: null });

  useEffect(() => {
    const level = account?.level;
    if (typeof level !== "number") {
      setTownHallDetails(null);
      setNextTownHallDetails(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [cur, nxt] = await Promise.all([
          getTownHallRow(level),
          getTownHallRow(level + 1),
        ]);
        if (!cancelled) {
          setTownHallDetails(cur ?? null);
          setNextTownHallDetails(nxt ?? null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load Town Hall data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [account?.level]);

  const durationToMs = useMemo(
    () => (nextTownHallDetails ? parseDurationToMs(nextTownHallDetails.buildTime) ?? 0 : 0),
    [nextTownHallDetails]
  );

  return loading ? (
    <Spinner label="Fetching…" />
  ) : (
    // <div className="px-5 pb-10 pt-5 space-y-4"></div>
    <main className="px-5 pb-10 pt-5 space-y-4">
      <header className="mb-6 flex items-center gap-3">
        <h1 className="text-[1.6rem] font-semibold">
          Account: <i>{account?.label}</i>
        </h1>
        <span className="ml-auto">
          <Link href="/accounts" className="text-sm text-emerald-400 hover:underline">
            ← Accounts
          </Link>
        </span>
      </header>

      {/* Summary strip */}
      <section className="mb-6 grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
        <Stat label="Current TH" value={`TH ${account?.level}`} />
        <Stat label={`To TH ${nextTownHallDetails?.th}`} value={formatMsShort(durationToMs)} />
        <Stat label="Cost (Gold)" value={nextTownHallDetails?.buildCostGold?.toLocaleString() ?? "—"} />
      </section>

      <div className="grid gap-6 lg:grid-cols-5 sm:grid-cols-2">
        <TownHallOverviewSection
          accountLevel={account?.level}
          townHallDetails={townHallDetails}
          nextTownHallDetails={nextTownHallDetails}
          durationMs={durationToMs || 0}
        />
        <aside className="lg:sticky lg:top-6 self-start space-y-6">
          <AccountContextCards
            account={account}
            nextTownHallDetails={nextTownHallDetails}
            durationMs={durationToMs || 0}
            onPlanUpgrade={() => {
              // TODO: open modal / dispatch plan action
              console.log('on plan upgrade clicked')
            }}
          />
        </aside>
      </div>
    </main>
  );
};

export default AccountDetailsPage;