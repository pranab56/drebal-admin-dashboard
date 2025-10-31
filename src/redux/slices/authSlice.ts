import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // Added optional role
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;

      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;

      // Store token and user data in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.refreshToken = null;
      state.isLoading = false;

      // Clear token and user data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");

        // Trigger logout event for other tabs
        localStorage.setItem("logoutEvent", Date.now().toString());
        localStorage.removeItem("logoutEvent");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logoutFromOtherTab: (state) => {
      // This action is triggered when logout happens in another tab
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.refreshToken = null;
      state.isLoading = false;
    },
    rehydrateAuth: (state) => {
      console.log("rehydrateAuth - Starting rehydration...");
      // Rehydrate authentication state from localStorage
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const userData = localStorage.getItem("userData");

        console.log("rehydrateAuth - accessToken:", accessToken);
        console.log("rehydrateAuth - userData:", userData);

        if (accessToken && userData) {
          try {
            const user = JSON.parse(userData);
            console.log("rehydrateAuth - Parsed user:", user);
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            console.log("rehydrateAuth - Authentication restored successfully");
          } catch (error) {
            console.log("rehydrateAuth - Error parsing user data:", error);
            // Clear invalid data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
          }
        } else {
          console.log(
            "rehydrateAuth - No valid auth data found in localStorage"
          );
        }
      }
      state.isLoading = false;
      console.log(
        "rehydrateAuth - Rehydration complete, isLoading set to false"
      );
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  rehydrateAuth,
  logoutFromOtherTab,
} = authSlice.actions;
export default authSlice.reducer;
