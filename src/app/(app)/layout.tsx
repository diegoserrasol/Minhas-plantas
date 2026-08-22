"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AppShell } from "@/components/navigation/AppShell";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Spinner />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
