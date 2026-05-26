"use client";

import ProtectedRoute from "@/services/auth/ProtectedRoute";

export default function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
