"use client";

import Link from "next/link";
import RoleGuard from "@/services/auth/RoleGuard";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin"]} fallbackPath="/events">
      <div className="min-h-screen p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <Link href="/staff/admin/users">
              <Button variant="outline">Users</Button>
            </Link>
            <Link href="/events">
              <Button variant="outline">Back to events</Button>
            </Link>
          </div>
        </div>
        {children}
      </div>
    </RoleGuard>
  );
}
