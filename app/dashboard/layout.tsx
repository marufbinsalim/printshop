// app/dashboard/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Ticket,
  Trophy,
  Settings,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Providers } from "../providers";
import AuthBasedComponent from "./authBasedComponent";

const MENU_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Tickets",
    href: "/dashboard/tickets",
    icon: Ticket,
  },
  {
    title: "My Wins",
    href: "/dashboard/wins",
    icon: Trophy,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <AuthGuard>
        <AuthBasedComponent>{children}</AuthBasedComponent>
      </AuthGuard>
    </AuthProvider>
  );
}
