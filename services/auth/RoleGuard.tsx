"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuthHydrated, selectUser } from "./authSelector";
import { isRoleAllowed } from "@/utils/roleUtil";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
};

export default function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = "/events",
}: Props) {
  const user = useSelector(selectUser);
  const isHydrated = useSelector(selectAuthHydrated);
  const router = useRouter();

  const isAuthorized = isRoleAllowed(user?.role, allowedRoles);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (user && !isAuthorized) {
      router.replace(fallbackPath);
    }
  }, [fallbackPath, isAuthorized, isHydrated, router, user]);

  if (!isHydrated || !user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}