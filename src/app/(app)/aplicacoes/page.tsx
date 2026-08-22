"use client";

import { History, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApplicationCard } from "@/features/applications/components/ApplicationCard";
import { useApplicationsHistory } from "@/hooks/useApplicationsHistory";
import { usePlants } from "@/hooks/usePlants";
import { useProducts } from "@/hooks/useProducts";

export default function ApplicationsHistoryPage() {
  const { data, loading, error, refetch } = useApplicationsHistory();
  const { data: plants } = usePlants();
  const { data: products } = useProducts();
  const [plantFilter, setPlantFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((application) => {
      if (plantFilter && application.plantId !== plantFilter) return false;
      if (productFilter && application.productId !== productFilter) return false;
      return true;
    });
  }, [data, plantFilter, productFilter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-stone-900">Histórico</h1>
        <Link
          href="/aplicacoes/nova"
          className="flex items-center gap-1.5 rounded-full bg-moss-600 px-4 py-2 text-sm font-medium text-stone-50 shadow-soft hover:bg-moss-700"
        >
          <Plus className="size-4" aria-hidden />
          Nova
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          aria-label="Filtrar por planta"
          value={plantFilter}
          onChange={(e) => setPlantFilter(e.target.value)}
        >
          <option value="">Todas as plantas</option>
          {plants?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filtrar por produto"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        >
          <option value="">Todos os produtos</option>
          {products?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon={History} title="Nenhuma aplicação encontrada" />
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            productName={application.product?.name}
            targetName={application.plant?.name ?? application.group?.name}
          />
        ))}
      </div>
    </div>
  );
}
