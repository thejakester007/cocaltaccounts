import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StructureKey = string & { __brand?: 'StructureKey' }; // still accepts any string
export const asStructureKey = (k: string): StructureKey => k.trim() as StructureKey;

export interface Structure {
  id: string;
  accountId: string;
  key: StructureKey;
  slot: number;
  level: number;
  thAtCapture: number;
  maxLevelAtTH?: number;
  maxCountAtTH?: number;
  upgrading?: boolean;
  endsAt?: number | null;
  note?: string | null;
}

type StructuresState = { list: Structure[] } | Structure[];
const initialState: StructuresState = { list: [] };

/* ---------- utils (match accounts slice style) ---------- */
function ensureList(state: StructuresState): Structure[] {
  const s = state as any;
  if (Array.isArray(s)) {
    const list: Structure[] = s;
    (state as any).list = list;
    return list;
  }
  if (!Array.isArray(s.list)) s.list = [];
  return s.list as Structure[];
}

const toNum = (x: unknown): number => {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
};

const toOptNum = (x: unknown): number | undefined =>
  x === null || x === undefined ? undefined : toNum(x);

const makeId = (accountId: string, key: string, slot: number) =>
  `${accountId}:${key}:${slot}`;

const withDefaults = (r: Structure): Structure => ({
  ...r,
  id: r.id || makeId(r.accountId, r.key, r.slot),
  slot: toNum(r.slot),
  level: toNum(r.level),
  thAtCapture: Math.max(1, toNum(r.thAtCapture || 1)),
  maxLevelAtTH: toOptNum(r.maxLevelAtTH),
  maxCountAtTH: toOptNum(r.maxCountAtTH),
  upgrading: !!r.upgrading,
  endsAt: r.endsAt == null ? undefined : toNum(r.endsAt),
  note: r.note ?? null,
});

const structuresSlice = createSlice({
  name: 'structures',
  initialState,
  reducers: {
    replaceAll(state, action: PayloadAction<Structure[]>) {
      const list = ensureList(state);
      list.length = 0;
      list.push(...action.payload.map(withDefaults));
    },

    /** Create or update one structure (by id). */
    upsert(state, action: PayloadAction<Structure>) {
      const list = ensureList(state);
      const rec = withDefaults(action.payload);
      const idx = list.findIndex((x) => x.id === rec.id);
      if (idx >= 0) list[idx] = { ...list[idx], ...rec };
      else list.push(rec);
    },

    /** Create or update many structures. */
    bulkUpsert(state, action: PayloadAction<Structure[]>) {
      const list = ensureList(state);
      const incoming = action.payload.map(withDefaults);
      for (const rec of incoming) {
        const idx = list.findIndex((x) => x.id === rec.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...rec };
        else list.push(rec);
      }
    },

    /** Remove one structure by id. */
    remove(state, action: PayloadAction<string>) {
      const list = ensureList(state);
      const idx = list.findIndex((x) => x.id === action.payload);
      if (idx >= 0) list.splice(idx, 1);
    },

    /** Purge all structures for an account (e.g., when deleting an account). */
    clearAccount(state, action: PayloadAction<string>) {
      const list = ensureList(state);
      const accountId = action.payload;
      let w = 0;
      for (let r = 0; r < list.length; r++) {
        if (list[r].accountId !== accountId) list[w++] = list[r];
      }
      list.length = w;
    },

    /** Set current level. */
    setLevel(state, action: PayloadAction<{ id: string; level: number }>) {
      const list = ensureList(state);
      const s = list.find((x) => x.id === action.payload.id);
      if (s) s.level = toNum(action.payload.level);
    },

    /** Start an upgrade and set completion time (epoch ms). */
    startUpgrade(state, action: PayloadAction<{ id: string; endsAt: number }>) {
      const list = ensureList(state);
      const s = list.find((x) => x.id === action.payload.id);
      if (!s) return;
      s.upgrading = true;
      s.endsAt = toNum(action.payload.endsAt);
    },

    /** Clear upgrade (keeps level as-is). */
    clearUpgrade(state, action: PayloadAction<string>) {
      const list = ensureList(state);
      const s = list.find((x) => x.id === action.payload);
      if (!s) return;
      s.upgrading = false;
      s.endsAt = undefined;
    },

    /** Optional convenience: set/clear a note. */
    setNote(state, action: PayloadAction<{ id: string; note: string | null }>) {
      const list = ensureList(state);
      const s = list.find((x) => x.id === action.payload.id);
      if (s) s.note = action.payload.note ?? null;
    },
  },
});

/** Create a stable id from parts, for callers that don’t want to repeat the template. */
export const structureId = makeId;

/** Derive a list filtered by account (pure; pass the slice state or slice.list). */
export function filterByAccount(state: StructuresState, accountId: string): Structure[] {
  const list = ensureList(state);
  return list.filter((s) => s.accountId === accountId);
}

/** Structures with upgrades due before timestamp. */
export function dueBefore(state: StructuresState, ts: number): Structure[] {
  const list = ensureList(state);
  return list.filter((s) => s.upgrading && (s.endsAt ?? Infinity) <= ts);
}

export const {
  replaceAll,
  upsert,
  bulkUpsert,
  remove,
  clearAccount,
  setLevel,
  startUpgrade,
  clearUpgrade,
  setNote,
} = structuresSlice.actions;

export const structuresReducer = structuresSlice.reducer;