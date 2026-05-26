// app/(protected)/staff/organiser/layout.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import RoleGuard from "@/services/auth/RoleGuard";
import { logout } from "@/redux/features/auth/authSlice";
import { selectUser } from "@/services/auth/authSelector";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/staff/organiser",
    icon: LayoutDashboard,
  },
  {
    title: "My Events",
    href: "/staff/organiser/events",
    icon: Calendar,
  },
  {
    title: "Bookings",
    href: "/staff/organiser/bookings",
    icon: Ticket,
    badge: 12, // Example: pending bookings count
  },
];

export default function OrganiserLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      // Continue with local logout even if server request fails.
    }
    dispatch(logout());
    router.push("/auth/login");
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <RoleGuard allowedRoles={["organiser", "admin"]} fallbackPath="/events">
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className="w-72 border-r bg-card flex flex-col sticky top-0 h-screen">
          {/* Logo & Organiser Info */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Planova
              </h1>
              <Badge variant="outline" className="text-xs">
                Organiser
              </Badge>
            </div>

            {/* Organiser Profile Quick View */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/organiser.jpg" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.name ?? "Organiser"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email ?? "No email"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Switch to User View</DropdownMenuItem>
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 pt-24 space-y-6 ">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/staff/organiser" &&
                  pathname.startsWith(item.href));

              return (
                <Link key={item.href} href={item.href} className="w-full">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start relative py-5 my-2"
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </RoleGuard>
  );
}
