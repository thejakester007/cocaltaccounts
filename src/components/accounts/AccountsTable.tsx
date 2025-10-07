'use client';

import React from 'react';
import type { Account } from '@/data/types';
import InlineEditableNumber from '@/app/components/inline-editable-number';
import { InlineEditableText } from './InlineEditableText';

type Props = {
  list: Account[];
  move: (id: string, dir: 'up' | 'down') => void;
  renameAccount: (id: string, newLabel: string) => void;
  setLevel: (id: string, v: number | undefined) => void;
  setNewUpgrade: (id: string) => void;
  clearUpgrade: (id: string) => void;
  removeAccount: (id: string) => void;
};

const AccountsTable: React.FC<Props> = ({
  list,
  move,
  renameAccount,
  setLevel,
  setNewUpgrade,
  clearUpgrade,
  removeAccount,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white/5 text-white/90">
            {['Account', 'Town Hall', 'Current / Nearest Upgrade', 'Actions'].map((h, i) => (
              <th key={h} className={`sticky top-0 px-3 py-3 ${i === 0 ? 'text-left' : 'text-center'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {list.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-white/60">
                No accounts found.
              </td>
            </tr>
          )}

          {list.map((acc, idx) => {
            const up = acc.activeUpgrade ?? null;

            return (
              <tr key={acc.id} className="hover:bg-white/5">
                {/* Account label + move */}
                <td className="px-3 py-3 align-top">
                  <div className="flex items-start gap-2">
                    {/* compact move buttons */}
                    <div className="flex flex-col gap-1 pt-0.5">
                      <button
                        onClick={() => move(acc.id, 'up')}
                        disabled={idx === 0}
                        title="Move up"
                        aria-label="Move up"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 active:translate-y-px disabled:opacity-40"
                      >
                        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                          <path d="M10 6l4 5H6l4-5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => move(acc.id, 'down')}
                        disabled={idx === list.length - 1}
                        title="Move down"
                        aria-label="Move down"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 active:translate-y-px disabled:opacity-40"
                      >
                        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                          <path d="M10 14l-4-5h8l-4 5z" />
                        </svg>
                      </button>
                    </div>

                    <div className="group relative min-w-0" title={acc.notes || undefined}>
                      <InlineEditableText
                        value={acc.label}
                        onChange={(val) => renameAccount(acc.id, val)}
                        placeholder="Account label"
                        strong
                      />
                    </div>
                  </div>
                </td>

                {/* TH level */}
                <td className="px-3 py-3 text-center align-top">
                  <InlineEditableNumber
                    value={acc.level ?? ''}
                    onChange={(v) => {
                      const val = (v ?? 0) as number;
                      // clamp TH to 2–17; empty clears
                      const clamped = val ? Math.min(17, Math.max(2, val)) : undefined;
                      setLevel(acc.id, clamped);
                    }}
                    placeholder="TH"
                    min={2}
                    max={17}
                  />
                </td>

                {/* Upgrade */}
                <td className="min-w-[260px] px-3 py-3 text-center align-top">
                  {up ? (
                    <>
                      <div className="font-semibold">{up.name}</div>
                      <div className="text-xs text-white/60">
                        {up.endsAtIso ? new Date(up.endsAtIso).toLocaleString() : 'No end time'}
                      </div>
                    </>
                  ) : (
                    <span className="text-white/50">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="whitespace-nowrap px-3 py-3 text-center align-top">
                  <button
                    onClick={() => setNewUpgrade(acc.id)}
                    className="mr-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 transition hover:bg-white/10"
                  >
                    Import JSON Data
                  </button>
                  <button
                    onClick={() => removeAccount(acc.id)}
                    className="rounded-xl border border-red-500/40 bg-red-600/80 px-3 py-2 text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;