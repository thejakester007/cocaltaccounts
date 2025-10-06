"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ========= Types ========= */
type TownHall = `th${9|10|11|12|13|14|15|16}`;
type UpgradeKind =
  | "Barracks" | "Archer Tower" | "Cannon" | "Laboratory" | "Spell Factory"
  | "Clan Castle" | "Walls" | "Inferno Tower" | "Eagle Artillery" | "Pet House" | "Other";

type Account = {
  id: string;
  name: string;
  role?: string;
  townHall: TownHall;
  archived?: boolean;
};

type Upgrade = {
  id: string;
  accountId: string;
  kind: UpgradeKind;
  buildingName?: string;
  startedAt: string; // ISO
  endsAt: string;    // ISO
};

type DueSoonItem = {
  upgrade: Upgrade;
  account: Account;
  remainingMs: number;
  totalMs: number;
};

/* ========= Settings ========= */
const DUE_SOON_HOURS = 6;   // show if finishing within 6h
const TICK_MS = 1000;

/* ========= Demo Data (swap with your store/selectors) ========= */
const now = () => new Date();
const isoIn = (mins: number) => new Date(now().getTime() + mins * 60_000).toISOString();

const ACCOUNTS: Account[] = [
  { id: "a1", name: "boy kulot", role: "leader", townHall: "th11" },
  { id: "a2", name: "fourdski", townHall: "th10" },
  { id: "a3", name: "dyik", role: "co-leader", townHall: "th10" },
  { id: "a4", name: "donski", role: "co-leader", townHall: "th9" },
  { id: "a5", name: "lady gaga", role: "wifey", townHall: "th9" },
];

const UPGRADES: Upgrade[] = [
  { id: "u1", accountId: "a2", kind: "Barracks", buildingName: "Barracks",
    startedAt: isoIn(-120), endsAt: isoIn(120) },   // 2h left
  { id: "u2", accountId: "a3", kind: "Archer Tower", buildingName: "Archer Tower (NW)",
    startedAt: isoIn(-600), endsAt: isoIn(15) },    // 15m left
  { id: "u3", accountId: "a4", kind: "Laboratory", buildingName: "Hogs Research",
    startedAt: isoIn(-60), endsAt: isoIn(360) },    // 6h left
];

/* ========= Utils ========= */
function formatRemaining(ms: number): string {
  if (ms <= 0) return "Ready";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function useNow(tick = TICK_MS) {
  const [ts, setTs] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTs(new Date()), tick);
    return () => clearInterval(id);
  }, [tick]);
  return ts;
}

function useCompletionNotifications() {
  const notified = useRef<Set<string>>(new Set());
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => void 0);
    }
  }, []);
  const schedule = (item: DueSoonItem) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (item.remainingMs <= 0) return;
    if (notified.current.has(item.upgrade.id)) return;
    const t = window.setTimeout(() => {
      try {
        new Notification("Upgrade complete!", {
          body: `${item.account.name}: ${item.upgrade.buildingName ?? item.upgrade.kind} is done.`,
          tag: `upgrade-complete-${item.upgrade.id}`,
        });
      } catch {}
      notified.current.add(item.upgrade.id);
    }, item.remainingMs);
    return () => window.clearTimeout(t);
  };
  return { schedule };
}

/* ========= Page ========= */
export default function Page() {
  const nowTs = useNow();

  const acctMap = useMemo(() => {
    const m = new Map<string, Account>();
    ACCOUNTS.forEach(a => m.set(a.id, a));
    return m;
  }, []);

  const dueSoon = useMemo<DueSoonItem[]>(() => {
    const horizonMs = DUE_SOON_HOURS * 3600_000;
    return UPGRADES
      .map(u => {
        const acc = acctMap.get(u.accountId)!;
        const end = new Date(u.endsAt).getTime();
        const start = new Date(u.startedAt).getTime();
        const remainingMs = end - nowTs.getTime();
        const totalMs = Math.max(1, end - start);
        return { upgrade: u, account: acc, remainingMs, totalMs };
      })
      .filter(x => x.remainingMs <= horizonMs)
      .sort((a, b) => a.remainingMs - b.remainingMs);
  }, [nowTs, acctMap]);

  const { schedule } = useCompletionNotifications();
  useEffect(() => {
    const cleanups = dueSoon.map(item => schedule(item)).filter(Boolean) as Array<() => void>;
    return () => cleanups.forEach(fn => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueSoon.map(d => d.upgrade.id + ":" + d.remainingMs).join("|")]);

  const total = ACCOUNTS.length;
  const active = ACCOUNTS.filter(a => !a.archived).length;
  const archived = ACCOUNTS.filter(a => a.archived).length;

  return (
    <div className="px-5 pb-10 pt-5">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>

      {/* KPIs */}
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <KpiCard title="Total accounts" value={total} />
        <KpiCard title="Active" value={active} />
        <KpiCard title="Archived" value={archived} />
      </div>

      {/* Due Soon */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Upgrades finishing soon (≤ {DUE_SOON_HOURS}h)</h2>
          <a href="/accounts" className="text-sm text-emerald-400 hover:text-emerald-300">Manage accounts →</a>
        </div>

        {dueSoon.length === 0 ? (
          <EmptyState
            title="No upgrades finishing soon"
            subtitle="When an upgrade is within the next few hours, it will show here with a live countdown and notify you when done."
          />
        ) : (
          <div className="grid gap-3">
            {dueSoon.map(item => {
              const pct = 1 - clamp01(item.remainingMs / item.totalMs);
              const endsAt = new Date(item.upgrade.endsAt);
              return (
                <div key={item.upgrade.id} className="flex items-center gap-3 rounded-lg border border-white/10 p-3">
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px] opacity-90">
                        {item.account.townHall.toUpperCase()}
                      </span>
                      <strong
                        className="text-base"
                        title={item.account.role ? `${item.account.name} — ${item.account.role}` : item.account.name}
                      >
                        {item.account.name}
                      </strong>
                      <span className="opacity-70">•</span>
                      <span className="opacity-90" title={item.upgrade.kind}>
                        {item.upgrade.buildingName ?? item.upgrade.kind}
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" aria-label="progress">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                        style={{ width: `${(pct * 100).toFixed(2)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs opacity-80">
                      <span>{item.remainingMs <= 0 ? "Ready" : `${formatRemaining(item.remainingMs)} left`}</span>
                      <span title={endsAt.toLocaleString()}>finishes at {endsAt.toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if ("Notification" in window) {
                        Notification.requestPermission().then(() => {
                          new Notification("Test notification", {
                            body: "You’ll get alerts when upgrades complete.",
                          });
                        });
                      }
                    }}
                    title="Send test notification"
                    className="rounded-md border border-white/20 px-2 py-1 text-base hover:bg-white/10"
                  >
                    🔔
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Accounts */}
      <section className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Accounts</h2>
          <a href="/accounts" className="text-sm text-emerald-400 hover:text-emerald-300">View all</a>
        </div>
        {ACCOUNTS.length === 0 ? (
          <EmptyState title="No accounts yet" subtitle="Add some in the Accounts page." />
        ) : (
          <div className="grid gap-2">
            {ACCOUNTS.map(a => (
              <div key={a.id} className={`flex items-center gap-2 text-sm ${a.archived ? "opacity-60" : "opacity-95"}`}>
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px]">
                  {a.townHall.toUpperCase()}
                </span>
                <span title={a.role ? `${a.name} — ${a.role}` : a.name}>{a.name}</span>
                {a.role && <span className="opacity-70">• {a.role}</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ========= Presentational ========= */
function KpiCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-1 text-[13px] opacity-85">{title}</div>
      <div className="text-3xl font-bold leading-none">{value}</div>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="py-3 opacity-90">
      <div className="mb-1">{title}</div>
      {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
    </div>
  );
}