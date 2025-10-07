// src/components/accounts/AddAccountForm.tsx
'use client';

import React, { useState } from 'react';
import type { Account } from '@/data/types';
import { uid } from '@/lib/accounts';

type Props = {
  onAdd: (acc: Account) => void;
};

const AddAccountForm: React.FC<Props> = ({ onAdd }) => {
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [level, setLevel] = useState<number | undefined>(undefined);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    onAdd({
      id: uid(),
      label: label.trim(),
      level,
      notes: notes.trim() || undefined,
      activeUpgrade: null,
    });

    setLabel('');
    setNotes('');
    setLevel(undefined);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 grid grid-cols-1 items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[2fr_3fr_auto]"
    >
      <label className="grid gap-1">
        <span className="text-white/80">Account Label</span>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Main TH14"
          required
          className="rounded-xl border border-white/10 bg-neutral-900/60 px-3 py-2 text-neutral-100 outline-none placeholder:text-white/40 focus:border-blue-500"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-white/80">Notes (optional)</span>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., focus heroes this month"
          className="rounded-xl border border-white/10 bg-neutral-900/60 px-3 py-2 text-neutral-100 outline-none placeholder:text-white/40 focus:border-blue-500"
        />
      </label>

      <button
        type="submit"
        title="Add account"
        aria-label="Add account"
        disabled={!label.trim()}
        className="justify-self-end self-end inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-blue-600 text-white shadow-sm transition hover:bg-blue-500 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-500/60 disabled:cursor-not-allowed disabled:opacity-40 group"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 transition-transform duration-150 group-hover:rotate-90">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Add</span>
      </button>
    </form>
  );
};

export default AddAccountForm;