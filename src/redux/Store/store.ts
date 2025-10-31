import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Import your slices here
import authSlice from "../slices/authSlice";
import { api } from "../getBaseApi";
import usersSlice from "../slices/usersSlice";
import studySlice from "../slices/studySlice";
import nextGenSlice from "../slices/nextGenSlice";
import standAloneExamSlice from "../slices/standAloneExamSlice";
import readinessExamSlice from "../slices/readinessExamSlice";
import notificationSlice from "../slices/notificationSlice";
// Root reducer
const rootReducer = combineReducers({
  // Add your reducers here
  auth: authSlice,
  [api.reducerPath]: api.reducer,
  users: usersSlice,
  study: studySlice,
  nextGen: nextGenSlice,
  standAlone: standAloneExamSlice,
  readiness: readinessExamSlice,
  notifications: notificationSlice,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "users",
    "study",
    "nextGen",
    "standAlone",
    "readiness",
    "notifications",
  ], // Persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
        ],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
