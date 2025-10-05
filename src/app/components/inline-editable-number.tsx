'use client';

import * as React from 'react';

export default function InlineEditableNumber({
    value,
    onChange,
    placeholder,
    min,
    max,
}: {
    value: number | '';
    onChange: (v: number | '') => void;
    placeholder?: string;
    min?: number;
    max?: number;
}) {
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value === '' ? '' : String(value));

    React.useEffect(() => setDraft(value === '' ? '' : String(value)), [value]);

    function commit() {
        const n = draft.trim() === '' ? '' : Number(draft);
        if (n !== '' && (isNaN(n) || (min !== undefined && n < min) || (max !== undefined && n > max))) return;
        onChange(n);
        setEditing(false);
    }

    if (!editing) {
        return (
            <div onClick={() => setEditing(true)} title="Click to edit" className="cursor-text">
                <span className={value === '' ? 'text-white/50' : 'font-semibold'}>
                    {value === '' ? (placeholder || '—') : `TH${value}`}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <input
                autoFocus
                inputMode="numeric"
                value={draft}
                onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ''))}
                onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
                className="w-16 rounded-xl border border-white/10 bg-neutral-900/60 px-2 py-1 text-center outline-none focus:border-blue-500"
                placeholder={placeholder || ''}
            />
            <button onClick={commit} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10">Save</button>
            <button onClick={() => setEditing(false)} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10">Cancel</button>
        </div>
    );
}
