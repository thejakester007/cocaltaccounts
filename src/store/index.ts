"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import {
  persistReducer,
  persistStore,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "./persistStorage";

//#region Imports
// add Imports here!!!
import { accountsReducer } from "./accountStore";
import { structuresReducer } from "./structuresStore";
//#endregion

//#region Reducers
// --- root reducer (easy to add more slices later) ---
const rootReducer = combineReducers({
  accounts: accountsReducer,
  structures: structuresReducer
});
//#endregion

// --- persistence (only persist what we need) ---
const persistConfig = {
  key: "coc-upgrade-tracker",
  storage,
  whitelist: ["accounts", "structures"], // add other slice keys later
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- store ---
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// --- types & hooks ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;