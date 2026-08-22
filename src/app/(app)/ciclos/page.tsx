"use client";

import { Plus, Repeat } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { CycleCard } from "@/features/cycles/components/CycleCard";
import {
  deleteCycle,
  pauseCycle,
  reactivateCycle,
} from "@/features/cycles/useCases/cycleUseCases";
import { useAuth } from "@/hooks/useAuth";
import { useCycles } from "@/hooks/useCycles";
import { useGroups } from "@/hooks/useGroups";
import { usePlants } from "@/hooks/usePlants";
import { useProducts } from "@/hooks/useProducts";

export default function CyclesPage() {
  const { user } = useAuth();
  const { data: cycles, loading, error, refetch } = useCycles();
  const { data: plants } = usePlants();
  const { data: groups } = useGroups();
  const { data: products } = useProducts();

  const visibleCycles = cycles?.filter((c) => c.status !== "excluido");
  const productsById = new Map(products?.map((p) => [p.id, p]));
  const plantsById = new Map(plants?.map((p) => [p.id, p]));
  const groupsById = new Map(groups?.map((g) => [g.id, g]));

  async function handle(action: () => Promise<void>) {
    await action();
    refetch();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-stone-900">Ciclos</h1>
        <Link
          href="/ciclos/novo"
          className="flex items-center gap-1.5 rounded-full bg-moss-600 px-4 py-2 text-sm font-medium text-stone-50 shadow-soft hover:bg-moss-700"
        >
          <Plus className="size-4" aria-hidden />
          Novo
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {!loading && !error && visibleCycles?.length === 0 && (
        <EmptyState
          icon={Repeat}
          title="Nenhum ciclo criado"
          description="Crie um ciclo para acompanhar automaticamente a próxima aplicação."
          action={
            <Link
              href="/ciclos/novo"
              className="text-sm font-medium text-moss-700 underline underline-offset-2"
            >
              Criar ciclo
            </Link>
          }
        />
      )}

      <div className="flex flex-col gap-3">
        {visibleCycles?.map((cycle) => (
          <CycleCard
            key={cycle.id}
            cycle={cycle}
            product={productsById.get(cycle.productId)}
            targetName={
              cycle.plantId
                ? plantsById.get(cycle.plantId)?.name
                : cycle.groupId
                  ? groupsById.get(cycle.groupId)?.name
                  : undefined
            }
            onPause={() => user && handle(() => pauseCycle(user.uid, cycle.id))}
            onReactivate={() =>
              user && handle(() => reactivateCycle(user.uid, cycle.id))
            }
            onDelete={() => user && handle(() => deleteCycle(user.uid, cycle.id))}
          />
        ))}
      </div>
    </div>
  );
}
