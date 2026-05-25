"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "./store";
import { logout } from "./features/auth/authSlice";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleLogout = () => {
      store.dispatch(logout());
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;