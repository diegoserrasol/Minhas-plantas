"use client";

import { Plus, Sprout } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  PlantFilterChips,
  type PlantFilter,
} from "@/features/plants/components/PlantFilterChips";
import { PlantCard } from "@/features/plants/components/PlantCard";
import { PlantSearchBar } from "@/features/plants/components/PlantSearchBar";
import { usePlantsWithCareStatus } from "@/hooks/usePlantsWithCareStatus";

export default function PlantsPage() {
  const { data, loading, error, refetch } = usePlantsWithCareStatus();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PlantFilter>("todas");

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();

    return data.plants.filter((plant) => {
      if (filter === "grupos" && !plant.groupId) return false;
      if (filter === "hoje" && plant.urgency !== "hoje") return false;
      if (filter === "atrasado" && plant.urgency !== "atrasado") return false;

      if (!term) return true;
      const groupName = plant.groupId
        ? data.groupsById.get(plant.groupId)?.name ?? ""
        : "";
      return (
        plant.name.toLowerCase().includes(term) ||
        (plant.species ?? "").toLowerCase().includes(term) ||
        groupName.toLowerCase().includes(term)
      );
    });
  }, [data, search, filter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-stone-900">Plantas</h1>
        <Link
          href="/plantas/nova"
          className="flex items-center gap-1.5 rounded-full bg-moss-600 px-4 py-2 text-sm font-medium text-stone-50 shadow-soft hover:bg-moss-700"
        >
          <Plus className="size-4" aria-hidden />
          Nova
        </Link>
      </div>

      <PlantSearchBar value={search} onChange={setSearch} />
      <PlantFilterChips value={filter} onChange={setFilter} />

      {loading && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {!loading && !error && data && data.plants.length === 0 && (
        <EmptyState
          icon={Sprout}
          title="Ainda não há plantas por aqui 🌱"
          description="Adicione sua primeira planta para começar."
          action={
            <Link
              href="/plantas/nova"
              className="text-sm font-medium text-moss-700 underline underline-offset-2"
            >
              Adicionar planta
            </Link>
          }
        />
      )}

      {!loading && !error && data && data.plants.length > 0 && filtered.length === 0 && (
        <EmptyState title="Nenhuma planta encontrada" description="Tente outro filtro ou busca." />
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}
