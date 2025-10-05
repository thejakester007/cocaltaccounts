"use client";

import Link from "next/link";
import { useAppSelector } from "@/store";
import { selectAccounts, selectActiveCount } from "@/store/accountStore";

export default function MainDashboard() {
  const accounts = useAppSelector(selectAccounts);
  const activeCount = useAppSelector(selectActiveCount);

  return (
    <main className="space-y-6 p-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Link href="/pages/accounts" className="text-sm text-emerald-400 hover:underline">
          Manage accounts →
        </Link>
      </header>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-4">
          <div className="text-sm text-gray-400">Total accounts</div>
          <div className="mt-1 text-2xl font-semibold">{accounts.length}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-4">
          <div className="text-sm text-gray-400">Active</div>
          <div className="mt-1 text-2xl font-semibold">{activeCount}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-4">
          <div className="text-sm text-gray-400">Archived</div>
          <div className="mt-1 text-2xl font-semibold">{accounts.length - activeCount}</div>
        </div>
      </section>

      {/* Accounts list preview */}
      <section className="rounded-2xl border border-white/10 bg-gray-900/40 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Accounts</h2>
          <Link href="/accounts" className="text-xs text-emerald-400 hover:underline">View all</Link>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {accounts.length === 0 && (
            <p className="text-sm text-gray-400">No accounts yet—add some in the Accounts page.</p>
          )}

          {accounts.slice(0, 6).map((a) => (
            <Link
              key={a.id}
              href={`/account/${a.id}`}
              className="rounded-xl border border-white/10 bg-gray-950/60 p-3 hover:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-gray-400">
                    TH{a.level} • {a.playerTag || "no tag"}
                  </div>
                  {a.note && <div className="text-xs text-gray-500 mt-1">{a.note}</div>}
                </div>
                <span className={`text-xs ${a.isActive ? "text-emerald-400" : "text-amber-400"}`}>
                  {a.isActive ? "Active" : "Archived"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
