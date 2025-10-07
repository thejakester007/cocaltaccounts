'use client';

import React, { useRef } from 'react';
import Select from '@/app/components/select';
import type { Account, SortMode } from '@/data/types';
import { SORT_OPTIONS, uid, coerceAccount } from '@/lib/accounts';
import { useAppDispatch } from '@/store';
import { replaceAll } from '@/store/accountStore';

type Props = {
  query: string;
  onQuery: (v: string) => void;
  sortMode: SortMode;
  onSortMode: (v: SortMode) => void;
  accounts: Account[];
};

const AccountsToolbar: React.FC<Props> = ({
  query,
  onQuery,
  sortMode,
  onSortMode,
  accounts,
}) => {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(accounts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `coc-accounts-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importJsonFromFile = () => fileRef.current?.click();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error('Expected a JSON array.');

        // Merge strategy (same behavior as before):
        // - If `id` collides, replace existing with imported.
        // - Else if same `label` (case-insensitive), skip (avoid dupes).
        // - Else insert with new id if missing.
        const byId = new Map(accounts.map((a) => [a.id, a]));
        const byLabel = new Map(accounts.map((a) => [a.label.toLowerCase(), a]));

        for (const raw of parsed) {
          const acc = coerceAccount(raw);
          if (!acc) continue;

          if (byId.has(acc.id)) {
            byId.set(acc.id, acc);
            byLabel.set(acc.label.toLowerCase(), acc);
          } else if (byLabel.has(acc.label.toLowerCase())) {
            // skip duplicate by label
            continue;
          } else {
            const id = acc.id || uid();
            byId.set(id, { ...acc, id });
            byLabel.set(acc.label.toLowerCase(), acc);
          }
        }

        dispatch(replaceAll(Array.from(byId.values())));
        alert('Import complete.');
      } catch (err: any) {
        alert(`Import failed: ${err?.message || err}`);
      } finally {
        e.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  const resetAll = () => {
    if (!confirm('This will delete ALL accounts from this browser. Continue?')) return;
    dispatch(replaceAll([]));
  };

  return (
    <section className="mb-4 flex flex-wrap items-center gap-3">
      <input
        placeholder="Search accounts / notes / upgrade…"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        className="min-w-[280px] flex-1 rounded-xl border border-white/10 bg-neutral-900/60 px-3 py-2 text-neutral-100 outline-none placeholder:text-white/40 focus:border-blue-500"
      />

      <label className="flex items-center gap-2">
        <span className="text-white/80">Sort:</span>
        <Select
          value={sortMode}
          onChange={(v) => onSortMode(v as SortMode)}
          options={SORT_OPTIONS as any}
          className="w-44"
        />
      </label>

      <button
        onClick={exportJson}
        className="rounded-xl border border-white/10 bg-white/90 px-4 py-2 font-medium text-neutral-900 transition hover:bg-white"
      >
        Export JSON
      </button>

      <button
        onClick={importJsonFromFile}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/90 transition hover:bg-white/10"
      >
        Import JSON
      </button>

      <button
        onClick={resetAll}
        className="ml-auto rounded-xl border border-red-500/40 bg-red-600/80 px-4 py-2 font-medium text-white transition hover:bg-red-600"
      >
        Reset All
      </button>

      <input
        type="file"
        accept="application/json"
        ref={fileRef}
        className="hidden"
        onChange={handleFileSelected}
      />
    </section>
  );
};

export default AccountsToolbar;
