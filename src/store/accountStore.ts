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

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    replaceAll(state, action: PayloadAction<Account[]>) {
      const list = ensureList(state);
      list.length = 0;
      list.push(...action.payload);
    },
    addAccount(state, action: PayloadAction<Account>) {
      const list = ensureList(state);
      list.unshift(action.payload);
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
} = accountsSlice.actions;

export const accountsReducer = accountsSlice.reducer;
