// src/components/accounts/InlineEditableText.tsx
'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  strong?: boolean;
  multiline?: boolean;
};

export const InlineEditableText: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  strong,
  multiline,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    const v = draft.trim();
    onChange(v);
    setEditing(false);
  };

  if (!editing) {
    const display = value || placeholder || '';
    return (
      <div
        onClick={() => setEditing(true)}
        title="Click to edit"
        className="cursor-text"
        role="button"
        aria-label="Edit text"
      >
        <span style={{ opacity: value ? 1 : 0.6, fontWeight: strong ? 700 : 400 }}>
          {display || '—'}
        </span>
      </div>
    );
  }

  if (multiline) {
    return (
      <div className="grid gap-2">
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-neutral-100 outline-none placeholder:text-white/40 focus:border-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={commit}
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1 text-white hover:bg-white/20"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-white hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        className="rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-neutral-100 outline-none placeholder:text-white/40 focus:border-blue-500"
      />
      <button
        onClick={commit}
        className="rounded-md border border-white/10 bg-white/10 px-3 py-1 text-white hover:bg-white/20"
      >
        Save
      </button>
      <button
        onClick={() => setEditing(false)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-white hover:bg-white/10"
      >
        Cancel
      </button>
    </div>
  );
};

export default InlineEditableText;