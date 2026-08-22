"use client";

import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data } = useDashboard();

  return (
    <div>
      <h1 className="font-serif text-2xl text-stone-900">
        Bom dia, {user?.displayName?.split(" ")[0]} 🌱
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        {data ? `${data.plantCount} plantas cadastradas.` : "Carregando..."}
      </p>
    </div>
  );
}
