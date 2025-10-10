'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Account, SortMode } from '@/data/types';
import { STORAGE_KEY, uid } from '@/lib/accounts';
import AccountsToolbar from '@/components/accounts/AccountsToolbar';
import AddAccountForm from '@/components/accounts/AddAccountForm';
import AccountsTable from '@/components/accounts/AccountsTable';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  addAccount as addAccountAction,
  removeAccount as removeAccountAction,
  renameAccount as renameAccountAction,
  setLevel as setLevelAction,
  setUpgrade as setUpgradeAction,
  clearUpgrade as clearUpgradeAction,
  moveAccount as moveAccountAction,
} from '@/store/accountStore';

// ---- PAGE (state & handlers; composes subcomponents) ----
const ManageAccountsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('created');

  const rawAccounts = useAppSelector((s) => s.accounts as any);
  const accounts: Account[] = Array.isArray(rawAccounts)
    ? rawAccounts
    : rawAccounts?.list ?? [];

  // handlers (dispatching to slice)
  const addAccount = (acc: Account) => dispatch(addAccountAction(acc));

  const removeAccount = (id: string) => {
    if (!confirm('Delete this account?')) return;
    dispatch(removeAccountAction(id));
  };

  const renameAccount = (id: string, newLabel: string) =>
    dispatch(renameAccountAction({ id, label: newLabel }));

  const setLevel = (id: string, v: number | undefined) =>
    dispatch(setLevelAction({ id, level: v }));

  const clearUpgrade = (id: string) => dispatch(clearUpgradeAction(id));

  const setNewUpgrade = (id: string) => {
    const name = window.prompt('Upgrade name (e.g., Archer Tower 10→11):')?.trim();
    if (name == null) return;
    const when = window.prompt('Ends at (ISO or yyyy-mm-ddThh:mm):')?.trim();
    if (when == null) return;

    const parsed = new Date(when);
    if (isNaN(parsed.getTime())) {
      alert('Could not parse date/time. Try 2025-10-05T22:30');
      return;
    }
    dispatch(
      setUpgradeAction({
        id,
        upgrade: { id: uid(), name, endsAtIso: parsed.toISOString() },
      }),
    );
  };

  const move = (id: string, dir: 'up' | 'down') =>
    dispatch(moveAccountAction({ id, dir }));

  // filtered/sorted list (derived UI state)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q
      ? accounts.filter(
        (a) =>
          a.label.toLowerCase().includes(q) ||
          (a.notes && a.notes.toLowerCase().includes(q)) ||
          (a.activeUpgrade?.name && a.activeUpgrade.name.toLowerCase().includes(q)),
      )
      : accounts.slice();
    if (sortMode === 'alpha') list.sort((a, b) => a.label.localeCompare(b.label));
    return list;
  }, [accounts, query, sortMode]);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-4 flex items-center gap-3">
        <h1 className="text-[1.6rem] font-semibold">Manage Accounts</h1>
        <span className="ml-auto">
          <Link href="/" className="text-sm text-emerald-400 hover:underline">← Dashboard</Link>
        </span>
      </header>

      <AccountsToolbar
        query={query}
        onQuery={setQuery}
        sortMode={sortMode}
        onSortMode={setSortMode}
        accounts={accounts}
      />

      <AddAccountForm onAdd={addAccount} />

      <AccountsTable
        list={filtered}
        move={move}
        renameAccount={renameAccount}
        setLevel={setLevel}
        setNewUpgrade={setNewUpgrade}
        clearUpgrade={clearUpgrade}
        removeAccount={removeAccount}
      />
    </main>
  );
};

export default ManageAccountsPage;