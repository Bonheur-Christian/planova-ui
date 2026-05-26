// components/custom/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Ticket,
  MapPin,
  Search,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next13-progressbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { selectUser } from "@/services/auth/authSelector";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";

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
  statusFilter = "ALL",
  onStatusChange = () => {},
}: AppSidebarProps) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const [logoutRequest] = useLogoutMutation();

  const hasActiveFilters =
    searchQuery || selectedLocation || statusFilter !== "ALL";

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/events/me", label: "My Bookings", icon: Ticket },
  ];

  //Logout logic
  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      // Continue with local logout even if server request fails.
    }
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <aside className="w-full md:w-80 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Planova</h1>

          <p className="text-xs text-muted-foreground">
            {variant === "events"
              ? "Discover amazing events"
              : "Manage your bookings"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">
                  {user?.name ? user.name : "User"}
                </span>

                <span className="text-xs text-muted-foreground">
                  {user?.email ? user.email : "Email"}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <Link href="/dashboard/profile">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>

            <Link href="/dashboard/settings">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      </div>

      {/* Scrollable Filters Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                variant === "events"
                  ? "Search events..."
                  : "Search by event or ID..."
              }
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
              {["ALL", "BOOKED", "CANCELLED"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => onStatusChange(status)}
                  className="w-full justify-start"
                >
                  {status === "ALL"
                    ? "All Bookings"
                    : status.charAt(0) + status.slice(1).toLowerCase()}
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
          <Button
            variant="secondary"
            onClick={onClearFilters}
            className="w-full"
          >
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
          {variant === "bookings" && statusFilter !== "ALL" && (
            <Badge variant="secondary">
              {statusFilter}
              <button onClick={() => onStatusChange("ALL")} className="ml-2">
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
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
