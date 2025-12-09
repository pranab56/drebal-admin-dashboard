import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../src/features/auth/authApi";
import authReducer from "../src/features/auth/authSlice";

const apis = [authApi];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ...Object.fromEntries(apis.map((api) => [api.reducerPath, api.reducer])),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.map((api) => api.middleware)),
});
