"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EventsLayoutWrapperProps {
  children: ReactNode;
  sidebar: ReactNode;
  title?: string;
  showBookingButton?: boolean;
  bookingButtonLink?: string;
  bookingButtonText?: string;
}

export default function EventsLayoutWrapper({
  children,
  sidebar,
  title = "Events",
  showBookingButton = true,
  bookingButtonLink = "/dashboard/user",
  bookingButtonText = "My Bookings",
}: EventsLayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {sidebar}
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          
          {showBookingButton && (
            <Link href={bookingButtonLink}>
              <Button variant="outline">{bookingButtonText}</Button>
            </Link>
          )}
        </div>
        
        {children}
      </main>
    </div>
  );
}