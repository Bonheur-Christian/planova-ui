// redux/features/auth/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  clearAuthStorage,
  getAccessToken,
  getUser,
  saveAccessToken,
  saveUser,
} from "@/utils/authUtil";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface LoginPayload {
  user: User;
  token: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isHydrated = true;

      saveAccessToken(action.payload.token);
      saveUser(action.payload.user);
    },

    restoreSession: (state) => {
      const token = getAccessToken();
      const user = getUser();

      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }

      state.isHydrated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isHydrated = true;

      clearAuthStorage();
    },
  },
});

export const {
  login,
  logout,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;