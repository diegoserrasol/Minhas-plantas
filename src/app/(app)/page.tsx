"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Avatar } from "@/components/ui/Avatar";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import { ApplicationCard } from "@/features/applications/components/ApplicationCard";
import { CareCard } from "@/features/care/components/CareCard";
import { PlantPhoto } from "@/features/plants/components/PlantPhoto";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import type { CareItem } from "@/types/view-models";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDashboard();
  const [activeItem, setActiveItem] = useState<CareItem | null>(null);

  const firstName = user?.displayName?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Avatar src={user?.photoURL} name={user?.displayName ?? "Você"} size={44} />
        <div>
          <h1 className="font-serif text-xl text-stone-900">
            {greeting()}, {firstName} 🌱
          </h1>
          <Link href="/mais/config" className="text-xs text-stone-400">
            Configurações
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {data && (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-lg text-stone-900">Hoje</h2>

            {data.overdue.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-status-overdue/10 px-4 py-3 text-sm font-medium text-status-overdue">
                <AlertTriangle className="size-4" aria-hidden />
                {data.overdue.length}{" "}
                {data.overdue.length === 1 ? "cuidado atrasado" : "cuidados atrasados"}
              </div>
            )}

            {data.overdue.length === 0 && data.today.length === 0 && (
              <EmptyState
                title="Tudo certo por aqui 🌿"
                description="Nenhum cuidado programado para hoje."
              />
            )}

            <div className="flex flex-col gap-2">
              {[...data.overdue, ...data.today].map((item) => (
                <CareCard
                  key={item.cycle.id}
                  item={item}
                  onApply={() => setActiveItem(item)}
                />
              ))}
            </div>
          </section>

          {data.upcoming.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-stone-900">Próximos cuidados</h2>
              <div className="flex flex-col gap-2">
                {data.upcoming.slice(0, 6).map((item) => (
                  <CareCard
                    key={item.cycle.id}
                    item={item}
                    onApply={() => setActiveItem(item)}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-stone-900">Plantas</h2>
              <Link href="/plantas" className="text-sm font-medium text-moss-700">
                Ver todas
              </Link>
            </div>
            {data.plantCount === 0 ? (
              <EmptyState
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
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[...data.overdue, ...data.today, ...data.upcoming]
                  .filter((i) => i.plant)
                  .slice(0, 8)
                  .map((item) => (
                    <Link
                      key={item.plant!.id}
                      href={`/plantas/${item.plant!.id}`}
                      className="shrink-0"
                    >
                      <PlantPhoto
                        src={item.plant!.coverPhotoUrl}
                        alt={item.plant!.name}
                        className="size-16 rounded-lg"
                        sizes="64px"
                      />
                    </Link>
                  ))}
              </div>
            )}
          </section>

          {data.recentApplications.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-serif text-lg text-stone-900">Últimas aplicações</h2>
              <div className="flex flex-col gap-2">
                {data.recentApplications.slice(0, 5).map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    productName={application.product?.name}
                    targetName={application.plant?.name ?? application.group?.name}
                  />
                ))}
              </div>
            </section>
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
            initialProductId={activeItem.product.id}
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
