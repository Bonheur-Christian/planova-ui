"use client";

import { ReactNode } from "react";

// This is a wrapper component that will be used by both events and bookings
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar will be injected by child pages */}
      {children}
    </div>
  );
}