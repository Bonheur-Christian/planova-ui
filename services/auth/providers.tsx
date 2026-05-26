"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login, logout, restoreSession } from "@/redux/features/auth/authSlice";
import { selectAuthHydrated, selectToken } from "./authSelector";
import { authApi } from "@/redux/features/auth/auth.api";
import { isRoleAllowed } from "@/utils/roleUtil";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const isHydrated = useSelector(selectAuthHydrated);
  const token = useSelector(selectToken);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated || !token) {
      return;
    }

    const request = dispatch(
      authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }),
    );

    request
      .unwrap()
      .then((response) => {
        if (!response?.data || !isRoleAllowed(response.data.role, ["admin", "organizer", "user"])) {
          dispatch(logout());
          return;
        }

        dispatch(
          login({
            token,
            user: {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role,
            },
          }),
        );
      })
      .catch(() => {
        dispatch(logout());
      });

    return () => {
      request.unsubscribe();
    };
  }, [dispatch, isHydrated, token]);

  return <>{children}</>;
}