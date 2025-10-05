"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Account = {
    id: string;
    name: string;
    level: number;
    note?: string;
    playerTag: string;
    apiKey: string;
    isActive: boolean
};

export type AccountsState = {
    accounts: Account[];
};

const initialState: AccountsState = { accounts: [] };

const accountsSlice = createSlice({
    name: "accounts",
    initialState,
    reducers: {
        addAccount: (s, { payload }: PayloadAction<{
            name: string;
            level: number;
            playerTag: string;
            apiKey: string;
            note?: string
        }>) => {
            s.accounts.unshift({
                id: crypto.randomUUID(),
                name: payload.name,
                level: payload.level,
                note: payload.note,
                playerTag: payload.playerTag,
                apiKey: payload.apiKey,
                isActive: true
            });
        },
        renameAccount: (s, { payload }: PayloadAction<{
            id: string;
            name: string;
            level: number;
            note?: string
        }>) => {
            const a = s.accounts.find(x => x.id === payload.id);
            if (a) {
                a.name = payload.name;
                a.level = payload.level;
                a.note = payload.note;
            }
        },
        toggleAccountActive: (s, { payload }: PayloadAction<{ id: string }>) => {
            const a = s.accounts.find(x => x.id === payload.id);
            if (a) a.isActive = !a.isActive;
        },
        deleteAccount: (s, { payload }: PayloadAction<{ id: string }>) => {
            s.accounts = s.accounts.filter(x => x.id !== payload.id);
        },
        clearAllAccounts: () => initialState,
    },
});

export const {
    addAccount,
    renameAccount,
    toggleAccountActive,
    deleteAccount,
    clearAllAccounts,
} = accountsSlice.actions;

export const accountsReducer = accountsSlice.reducer;

/** Selectors */
export const selectAccounts = (state: { accounts: AccountsState }) => state.accounts.accounts;
export const selectActiveCount = (state: { accounts: AccountsState }) =>
    state.accounts.accounts.filter(a => a.isActive).length;