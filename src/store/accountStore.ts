import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Account, Upgrade } from '@/data/types';

type AccountsState = { list: Account[] } | Account[];

const initialState: AccountsState = { list: [] };

function ensureList(state: AccountsState): Account[] {
  const s = state as any;
  if (Array.isArray(s)) {
    const list: Account[] = s;
    (state as any).list = list;
    return list;
  }
  if (!Array.isArray(s.list)) {
    s.list = [];
  }
  return s.list as Account[];
}

const toNum = (x: unknown): number => {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
};

const clampBuilders = (count: number, sixth: boolean | undefined) =>
  Math.max(0, Math.min(toNum(count), sixth ? 6 : 5));

const withResourceDefaults = (a: Account): Account => ({
  ...a,
  gold: toNum(a.gold ?? 0),
  elixir: toNum(a.elixir ?? 0),
  darkElixir: toNum(a.darkElixir ?? 0),
});

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    replaceAll(state, action: PayloadAction<Account[]>) {
      const list = ensureList(state);
      list.length = 0;
      list.push(...action.payload.map(withResourceDefaults));
    },
    addAccount(state, action: PayloadAction<Account>) {
      const list = ensureList(state);
      list.unshift(withResourceDefaults(action.payload));
    },
    removeAccount(state, action: PayloadAction<string>) {
      const list = ensureList(state);
      const idx = list.findIndex((a) => a.id === action.payload);
      if (idx >= 0) list.splice(idx, 1);
    },
    renameAccount(state, action: PayloadAction<{ id: string; label: string }>) {
      const list = ensureList(state);
      const a = list.find((x) => x.id === action.payload.id);
      if (a) a.label = action.payload.label;
    },
    setLevel(state, action: PayloadAction<{ id: string; level: number | undefined }>) {
      const list = ensureList(state);
      const a = list.find((x) => x.id === action.payload.id);
      if (a) a.level = action.payload.level;
    },
    setUpgrade(state, action: PayloadAction<{ id: string; upgrade: Upgrade | null }>) {
      const list = ensureList(state);
      const a = list.find((x) => x.id === action.payload.id);
      if (a) a.activeUpgrade = action.payload.upgrade;
    },
    clearUpgrade(state, action: PayloadAction<string>) {
      const list = ensureList(state);
      const a = list.find((x) => x.id === action.payload);
      if (a) a.activeUpgrade = null;
    },
    moveAccount(state, action: PayloadAction<{ id: string; dir: 'up' | 'down' }>) {
      const list = ensureList(state);
      const idx = list.findIndex((a) => a.id === action.payload.id);
      if (idx < 0) return;
      const target = action.payload.dir === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= list.length) return;
      const [item] = list.splice(idx, 1);
      list.splice(target, 0, item);
    },
    setResources(
      state,
      action: PayloadAction<{
        id: string;
        gold?: number | string | null;
        elixir?: number | string | null;
        darkElixir?: number | string | null;
      }>
    ) {
      const list = ensureList(state);
      const a = list.find(x => x.id === action.payload.id);
      if (!a) return;

      // keep current values if a field is omitted; coerce to number safely
      a.gold = toNum(action.payload.gold ?? a.gold ?? 0);
      a.elixir = toNum(action.payload.elixir ?? a.elixir ?? 0);
      a.darkElixir = toNum(action.payload.darkElixir ?? a.darkElixir ?? 0);
    },
    setBuildersCount(
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) {
      const a = ensureList(state).find(x => x.id === action.payload.id);
      if (!a) return;
      a.buildersCount = clampBuilders(action.payload.value, a.sixthBuilderUnlocked);
      if (action.payload.value === 5 && a.sixthBuilderUnlocked) {
        a.buildersCount = 4;
        a.sixthBuilderUnlocked = false;
      }
    },
    setSixthBuilderUnlocked(
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) {
      const a = ensureList(state).find(x => x.id === action.payload.id);
      if (!a) return;
      a.sixthBuilderUnlocked = !!action.payload.value;
      if (a.sixthBuilderUnlocked) {
        a.buildersCount = 6;
      }
      // auto-clamp if 6th turned off
      if (!a.sixthBuilderUnlocked && toNum(a.buildersCount) > 5) {
        a.buildersCount = 5;
      }
    }
  },
});

export const {
  replaceAll,
  addAccount,
  removeAccount,
  renameAccount,
  setLevel,
  setUpgrade,
  clearUpgrade,
  moveAccount,
  setResources,
  setBuildersCount,
  setSixthBuilderUnlocked
} = accountsSlice.actions;

export const accountsReducer = accountsSlice.reducer;
