// components/auth-guard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, userProfile, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    async function verifySession() {
      if (user) {
        try {
          // GET yerine POST kullanıyoruz
          const idToken = await user.getIdToken(true);

          const response = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            body: JSON.stringify({ idToken }),
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Session doğrulanamadı");
          }
        } catch (error) {
          console.error("Session doğrulama hatası:", error);
          router.replace("/");
        }
      } else {
        router.replace("/");
      }
    }

    if (!loading) {
      verifySession();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !userProfile) return null;

  return <>{children}</>;
}
