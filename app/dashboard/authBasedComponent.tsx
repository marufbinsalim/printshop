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
import { useAuth } from "@/contexts/auth-context";
import { Providers } from "../providers";

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

export default function AuthBasedComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, userProfile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pvimary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden border-r bg-muted/10 md:block md:w-64">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">
                  {user?.displayName || "User"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-1">
              {MENU_ITEMS.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === item.href && "bg-secondary",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <HelpCircle className="h-4 w-4" />
              {`Help & Support`}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
              onClick={() => {
                signOut();
                toast.success("Başarıyla çıkış yapıldı");
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
