// app/accounts/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Select, { SelectOption } from '@/app/components/select';
import InlineEditableNumber from '@/app/components/inline-editable-number';
import Link from 'next/link';

type Upgrade = {
    id: string;
    name: string;
    endsAtIso?: string;
};

type Account = {
    id: string;
    label: string;
    level: number | undefined;
    activeUpgrade?: Upgrade | null;
    notes?: string;
};

const STORAGE_KEY = 'COCALT_ACCOUNTS_V1';

const SORT_OPTIONS: SelectOption<'created' | 'alpha'>[] = [
    { id: 'created', label: 'Recent first' },
    { id: 'alpha', label: 'A → Z' },
];

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

export default function ManageAccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [query, setQuery] = useState('');
    const [label, setLabel] = useState('');
    const [level, setLevel] = useState(undefined);
    const [notes, setNotes] = useState('');
    const [sortMode, setSortMode] = useState<'alpha' | 'created'>('created');

    const fileRef = useRef<HTMLInputElement>(null);

    // load on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as Account[];
                if (Array.isArray(parsed)) setAccounts(parsed);
            }
        } catch {
            // ignore
        }
    }, []);

    // persist on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }, [accounts]);

    function addAccount(e: React.FormEvent) {
        e.preventDefault();
        if (!label.trim()) return;
        const acc: Account = {
            id: uid(),
            label: label.trim(),
            level: level,
            notes: notes.trim() || undefined,
            activeUpgrade: null,
        };
        setAccounts((prev) => [acc, ...prev]);
        setLabel('');
        setLevel(undefined);
        setNotes('');
    }

    function removeAccount(id: string) {
        if (!confirm('Delete this account?')) return;
        setAccounts((prev) => prev.filter((a) => a.id !== id));
    }

    function renameAccount(id: string, newLabel: string) {
        setAccounts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, label: newLabel } : a))
        );
    }

    function updateNotes(id: string, newNotes: string) {
        setAccounts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, notes: newNotes || undefined } : a))
        );
    }

    function clearUpgrade(id: string) {
        setAccounts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, activeUpgrade: null } : a))
        );
    }

    function setNewUpgrade(id: string) {
        const name = window.prompt('Upgrade name (e.g., Archer Tower 10→11):')?.trim();
        if (name == null) return;
        const when = window.prompt('Ends at (ISO or yyyy-mm-ddThh:mm):')?.trim();
        if (when == null) return;

        const parsed = new Date(when);
        if (isNaN(parsed.getTime())) {
            alert('Could not parse date/time. Try 2025-10-05T22:30');
            return;
        }
        setAccounts((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, activeUpgrade: { id: uid(), name, endsAtIso: parsed.toISOString() } } : a
            )
        );
    }

    function move(id: string, dir: 'up' | 'down') {
        setAccounts((prev) => {
            const idx = prev.findIndex((a) => a.id === id);
            if (idx < 0) return prev;
            const target = dir === 'up' ? idx - 1 : idx + 1;
            if (target < 0 || target >= prev.length) return prev;
            const copy = prev.slice();
            const [item] = copy.splice(idx, 1);
            copy.splice(target, 0, item);
            return copy;
        });
    }

    // export / import
    function exportJson() {
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
    }

    function importJsonFromFile() {
        fileRef.current?.click();
    }

    function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));
                if (!Array.isArray(parsed)) throw new Error('Expected a JSON array.');
                // Merge strategy:
                // - If `id` collides, replace existing with imported.
                // - If no `id` but same `label`, keep existing and skip (avoid dupes).
                setAccounts((prev) => {
                    const byId = new Map(prev.map((a) => [a.id, a]));
                    const byLabel = new Map(prev.map((a) => [a.label.toLowerCase(), a]));
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
                            byId.set(acc.id || uid(), acc.id ? acc : { ...acc, id: uid() });
                            byLabel.set(acc.label.toLowerCase(), acc);
                        }
                    }
                    return Array.from(byId.values());
                });
                alert('Import complete.');
            } catch (err: any) {
                alert(`Import failed: ${err?.message || err}`);
            } finally {
                e.target.value = '';
            }
        };
        reader.readAsText(file);
    }

    function coerceAccount(x: any): Account | null {
        if (!x || typeof x !== 'object') return null;
        if (!x.label || typeof x.label !== 'string') return null;
        const a: Account = {
            id: typeof x.id === 'string' ? x.id : uid(),
            label: x.label,
            level: x.level,
            notes: typeof x.notes === 'string' && x.notes.trim() ? x.notes : undefined,
            activeUpgrade: x.activeUpgrade
                ? {
                    id: typeof x.activeUpgrade.id === 'string' ? x.activeUpgrade.id : uid(),
                    name: String(x.activeUpgrade.name ?? 'Unnamed Upgrade'),
                    endsAtIso: x.activeUpgrade.endsAtIso ? String(x.activeUpgrade.endsAtIso) : undefined,
                }
                : null,
        };
        return a;
    }

    function resetAll() {
        if (!confirm('This will delete ALL accounts from this browser. Continue?')) return;
        setAccounts([]);
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = q
            ? accounts.filter(
                (a) =>
                    a.label.toLowerCase().includes(q) ||
                    (a.notes && a.notes.toLowerCase().includes(q)) ||
                    (a.activeUpgrade?.name && a.activeUpgrade.name.toLowerCase().includes(q))
            )
            : accounts.slice();

        if (sortMode === 'alpha') list.sort((a, b) => a.label.localeCompare(b.label));
        // 'created' preserves insertion order (most recent first because we unshift on add)

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

            {/* Toolbar */}
            <section className="mb-4 flex flex-wrap items-center gap-3">
                <input
                    placeholder="Search accounts / notes / upgrade…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-w-[280px] flex-1 rounded-xl border border-white/10 bg-neutral-900/60 px-3 py-2 text-neutral-100 outline-none placeholder:text-white/40 focus:border-blue-500"
                />
                <label className="flex items-center gap-2">
                    <span className="text-white/80">Sort:</span>
                    <Select
                        value={sortMode}
                        onChange={(v) => setSortMode(v)}
                        options={SORT_OPTIONS}
                        className="w-44" // tweak width as you like
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

            {/* Add form */}
            <form
                onSubmit={addAccount}
                className="mb-4 grid grid-cols-1 items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[2fr_3fr_auto]"
            >
                <label className="grid gap-1">
                    <span className="text-white/80">Account Label</span>
                    <input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g., Main TH14"
                        required
                        className="rounded-xl border border-white/10 bg-neutral-900/60 px-3 py-2 text-neutral-100 outline-none placeholder:text-white/40focus:border-blue-500"
                    />
                </label>

                <label className="grid gap-1">
                    <span className="text-white/80">Notes (optional)</span>
                    <input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., focus heroes this month"
                        className=" rounded-xl border border-white/10 bg-neutral-900/60 px-3 py-2 text-neutral-100 outline-none placeholder:text-white/40 focus:border-blue-500"
                    />
                </label>

                <button type="submit" title="Add account" aria-label="Add account" disabled={!label.trim()} className="justify-self-end self-end inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-blue-600 text-white shadow-sm transition hover:bg-blue-500 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-500/60 disabled:cursor-not-allowed disabled:opacity-40 group">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 transition-transform duration-150 group-hover:rotate-90">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="sr-only">Add</span>
                </button>
            </form>

            {/* Table */}
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
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-white/60">No accounts found.</td>
                            </tr>
                        )}

                        {filtered.map((acc, idx) => {
                            const up = acc.activeUpgrade ?? null; // nearest-to-done (single active for now)
                            return (
                                <tr key={acc.id} className="hover:bg-white/5">
                                    {/* Account label + move */}
                                    <td className="px-3 py-3 align-top">
                                        <div className="flex items-start gap-2">
                                            {/* compact move buttons (left of name) */}
                                            <div className="flex flex-col gap-1 pt-0.5">
                                                <button onClick={() => move(acc.id, 'up')} disabled={idx === 0} title="Move up" aria-label="Move up" className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 active:translate-y-px disabled:opacity-40">
                                                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true"><path d="M10 6l4 5H6l4-5z" /></svg>
                                                </button>
                                                <button onClick={() => move(acc.id, 'down')} disabled={idx === filtered.length - 1} title="Move down" aria-label="Move down" className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 active:translate-y-px disabled:opacity-40">
                                                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true"><path d="M10 14l-4-5h8l-4 5z" /></svg>
                                                </button>
                                            </div>

                                            {/* name with tooltip-on-hover for notes */}
                                            <div className="group relative min-w-0" title={acc.notes || undefined}>
                                                <InlineEditableText
                                                    value={acc.label}
                                                    onChange={(val) => renameAccount(acc.id, val)}
                                                    placeholder="Account label"
                                                    strong
                                                />

                                                {/* tooltip (only if notes exist) */}
                                                {acc.notes && (
                                                    <div role="tooltip" className="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden max-w-xs select-none rounded-lg border border-white/10 bg-neutral-900/95 px-3 py-2 text-xs text-neutral-100 shadow-lg backdrop-blur group-hover:block">
                                                        <div className="whitespace-pre-line">{acc.notes}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </td>

                                    {/* Town Hall level (editable number) */}
                                    <td className="px-3 py-3 text-center align-top">
                                        <InlineEditableNumber
                                            value={acc.level ?? ''}
                                            onChange={(v) =>
                                                setAccounts((prev) => prev.map((a) => (a.id === acc.id ? { ...a, thLevel: v || undefined } : a)))
                                            }
                                            placeholder="TH"
                                            min={1}
                                            max={16}
                                        />
                                        {/* <InlineEditableNumber
                                            value={acc.level ?? ''}
                                            onChange={(v) =>
                                                setAccounts((prev) =>
                                                    prev.map((a) => {
                                                        const val = (v ?? 0) as number;
                                                        // clamp to TH2–TH17
                                                        const clamped = val ? Math.min(17, Math.max(2, val)) : undefined;
                                                        return a.id === acc.id ? { ...a, level: clamped as TownHallLevel | undefined } : a;
                                                    })
                                                )
                                            }
                                            placeholder="TH"
                                            min={2}
                                            max={17}
                                        /> */}
                                    </td>

                                    {/* Current / Nearest Upgrade */}
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
                                        <button onClick={() => setNewUpgrade(acc.id)} className="mr-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 transition hover:bg-white/10">
                                            Set/Replace Upgrade
                                        </button>
                                        <button
                                            onClick={() => clearUpgrade(acc.id)}
                                            disabled={!acc.activeUpgrade}
                                            className="mr-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 transition hover:bg-white/10 disabled:opacity-40"
                                        >
                                            Clear Upgrade
                                        </button>
                                        <button onClick={() => removeAccount(acc.id)} className="rounded-xl border border-red-500/40 bg-red-600/80 px-3 py-2 text-white transition hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </main>
    );
}

/** Inline editable text input (single-line or multi-line) */
function InlineEditableText({
    value,
    onChange,
    placeholder,
    strong,
    multiline,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    strong?: boolean;
    multiline?: boolean;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    useEffect(() => setDraft(value), [value]);

    function commit() {
        const v = draft.trim();
        onChange(v);
        setEditing(false);
    }

    if (!editing) {
        const display = value || placeholder || '';
        return (
            <div onClick={() => setEditing(true)} title="Click to edit" style={{ cursor: 'text' }}>
                <span style={{ opacity: value ? 1 : 0.6, fontWeight: strong ? 700 : 400 }}>
                    {display || '—'}
                </span>
            </div>
        );
    }

    if (multiline) {
        return (
            <div style={{ display: 'grid', gap: 6 }}>
                <textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    style={{ padding: '0.5rem', borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={commit}>Save</button>
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') commit();
                    if (e.key === 'Escape') setEditing(false);
                }}
                style={{ padding: '0.4rem 0.6rem', borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)' }}
            />
            <button onClick={commit}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
    );
}