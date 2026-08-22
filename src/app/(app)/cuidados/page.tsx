"use client";

import { useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import { CareCard } from "@/features/care/components/CareCard";
import { useDashboard } from "@/hooks/useDashboard";
import type { CareItem } from "@/types/view-models";

export default function CuidadosPage() {
  const { data, loading, error, refetch } = useDashboard();
  const [activeItem, setActiveItem] = useState<CareItem | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-stone-900">Cuidados</h1>

      {loading && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {data && (
        <>
          <Section
            title="Atrasados"
            items={data.overdue}
            onApply={setActiveItem}
          />
          <Section title="Hoje" items={data.today} onApply={setActiveItem} />
          <Section
            title="Próximos"
            items={data.upcoming}
            onApply={setActiveItem}
          />

          {data.overdue.length === 0 &&
            data.today.length === 0 &&
            data.upcoming.length === 0 && (
              <EmptyState
                title="Tudo certo por aqui 🌿"
                description="Nenhum ciclo ativo no momento."
              />
            )}
        </>
      )}

      <ResponsiveDialog
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        title="Registrar aplicação"
      >
        {activeItem && (
          <ApplicationForm
            initialTarget={
              activeItem.plant
                ? { type: "plant", id: activeItem.plant.id }
                : { type: "group", id: activeItem.group!.id }
            }
            onSuccess={() => {
              setActiveItem(null);
              refetch();
            }}
          />
        )}
      </ResponsiveDialog>
    </div>
  );
}

function Section({
  title,
  items,
  onApply,
}: {
  title: string;
  items: CareItem[];
  onApply: (item: CareItem) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-lg text-stone-900">
        {title} <span className="text-sm font-sans text-stone-400">({items.length})</span>
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <CareCard key={item.cycle.id} item={item} onApply={() => onApply(item)} />
        ))}
      </div>
    </section>
  );
}
