"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import {
  selectAuthHydrated,
  selectIsAuthenticated,
} from "@/services/auth/authSelector";

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isHydrated = useSelector(selectAuthHydrated);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`${redirectTo}${next}`);
    }
  }, [isAuthenticated, isHydrated, pathname, redirectTo, router]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}