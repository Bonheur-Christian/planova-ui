// components/custom/app-sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  Ticket, 
  MapPin, 
  Search, 
  X,
  Home,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  // For events page
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
  locations?: string[];
  onClearFilters?: () => void;
  
  // For bookings page
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  
  // Common props
  variant?: "events" | "bookings";
}

export function EventsSidebar({ 
  variant = "events",
  searchQuery = "",
  onSearchChange = () => {},
  selectedLocation = "",
  onLocationChange = () => {},
  locations = [],
  onClearFilters = () => {},
  statusFilter = "all",
  onStatusChange = () => {},
}: AppSidebarProps) {
  const pathname = usePathname();
  const hasActiveFilters = searchQuery || selectedLocation || statusFilter !== "all";

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    // { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/events/me", label: "My Bookings", icon: Ticket },
  ]

  return (
    <aside className="w-full md:w-80 border-r bg-card flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Planova</h1>
        <p className="text-xs text-muted-foreground">
          {variant === "events" ? "Discover amazing events" : "Manage your bookings"}
        </p>
      </div>

      {/* Navigation Links */}
      <div className="p-4 border-b flex flex-col space-y-2 w-full">
        {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button 
                variant={isActive(href) ? "default" : "ghost"}
                className="w-full justify-start py-5 cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        {/* <Link href="/dashboard">
          <Button 
            variant={isActive("/dashboard") ? "default" : "ghost"} 
            className="w-full justify-start"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link> */}
        
        {/* <Link href="/events">
          <Button 
            variant={isActive("/events") ? "default" : "ghost"} 
            className="w-full justify-start"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Button>
        </Link> */}
        
        {/* <Link href="/dashboard/user">
          <Button 
            variant={isActive("/dashboard/user") ? "default" : "ghost"} 
            className="w-full justify-start"
          >
            <Ticket className="mr-2 h-4 w-4" />
            My Bookings
          </Button>
        </Link> */}
      </div>

      {/* Scrollable Filters Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={variant === "events" ? "Search events..." : "Search by event or ID..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Status Filter - Only for bookings page */}
        {variant === "bookings" && (
          <div className="space-y-2">
            <label className="text-sm font-semibold">Booking Status</label>
            <div className="space-y-2">
              {["all", "confirmed", "pending", "cancelled"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => onStatusChange(status)}
                  className="w-full justify-start"
                >
                  {status === "all" ? "All Bookings" : 
                   status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Location</label>
          <Button
            variant={!selectedLocation ? "default" : "outline"}
            onClick={() => onLocationChange("")}
            className="w-full justify-start"
          >
            All Locations
          </Button>
          <div className="space-y-2">
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? "default" : "outline"}
                onClick={() => onLocationChange(location)}
                className="w-full justify-start text-left"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {location}
              </Button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="secondary" onClick={onClearFilters} className="w-full">
            Clear Filters
          </Button>
        )}

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary">
              {searchQuery}
              <button onClick={() => onSearchChange("")} className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedLocation && (
            <Badge variant="secondary">
              {selectedLocation}
              <button onClick={() => onLocationChange("")} className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {variant === "bookings" && statusFilter !== "all" && (
            <Badge variant="secondary">
              {statusFilter}
              <button onClick={() => onStatusChange("all")} className="ml-2">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t space-y-2">
        <Link href="/dashboard/profile">
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}