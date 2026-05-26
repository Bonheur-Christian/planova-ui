import { RootState } from "@/redux/store";

export const selectUser = (
  state: RootState
) => state.auth.user;

export const selectToken = (
  state: RootState
) => state.auth.token;

export const selectAuthHydrated = (
  state: RootState
) => state.auth.isHydrated;

export const selectIsAuthenticated = (
  state: RootState
) => state.auth.isAuthenticated;