"use client";

import { Droplet, Pencil, Repeat, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDaysSince, formatDaysUntil } from "@/domain/care/careUrgency";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import { CycleForm } from "@/features/cycles/components/CycleForm";
import { PhotoCompare } from "@/features/photos/components/PhotoCompare";
import { PhotoGrid } from "@/features/photos/components/PhotoGrid";
import { PhotoUploader } from "@/features/photos/components/PhotoUploader";
import { PlantPhoto } from "@/features/plants/components/PlantPhoto";
import { PlantTimeline } from "@/features/plants/components/PlantTimeline";
import { deletePlant } from "@/features/plants/useCases/plantUseCases";
import { useAuth } from "@/hooks/useAuth";
import { useCyclesForPlant } from "@/hooks/useCycles";
import { usePlant } from "@/hooks/usePlant";
import { usePlantPhotos } from "@/hooks/usePlantPhotos";
import { usePlantTimeline } from "@/hooks/usePlantTimeline";
import { useProducts } from "@/hooks/useProducts";
import { todayLocalDate } from "@/lib/date";

export default function PlantDetailPage({
  params,
}: {
  params: Promise<{ plantId: string }>;
}) {
  const { plantId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const { data: plant, loading, error } = usePlant(plantId);
  const { data: cycles, refetch: refetchCycles } = useCyclesForPlant(plantId);
  const { data: products } = useProducts();
  const { data: photos, refetch: refetchPhotos } = usePlantPhotos(plantId);
  const { data: timeline, refetch: refetchTimeline } = usePlantTimeline(plantId);

  const [applicationOpen, setApplicationOpen] = useState(false);
  const [cycleOpen, setCycleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const today = todayLocalDate();
  const activeCycle = cycles?.find((c) => c.status === "ativo");
  const product = products?.find((p) => p.id === activeCycle?.productId);

  const selectedPhotos = useMemo(() => {
    if (selected.length !== 2 || !photos) return null;
    const [aId, bId] = selected;
    const a = photos.find((p) => p.id === aId);
    const b = photos.find((p) => p.id === bId);
    if (!a || !b) return null;
    return a.createdAt < b.createdAt ? { before: a, after: b } : { before: b, after: a };
  }, [selected, photos]);

  function toggleSelect(photoId: string) {
    setSelected((prev) => {
      if (prev.includes(photoId)) return prev.filter((id) => id !== photoId);
      if (prev.length === 2) return [prev[1], photoId];
      return [...prev, photoId];
    });
  }

  function refreshAll() {
    refetchCycles();
    refetchPhotos();
    refetchTimeline();
  }

  async function handleDelete() {
    if (!user) return;
    await deletePlant(user.uid, plantId);
    router.push("/plantas");
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }

  if (error || !plant) {
    return <ErrorState message="Não foi possível carregar esta planta." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <PlantPhoto
          src={plant.coverPhotoUrl}
          alt={plant.name}
          className="aspect-square w-full rounded-xl md:aspect-[16/9]"
          sizes="600px"
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl text-stone-900">{plant.name}</h1>
            {plant.species && <p className="text-sm text-stone-500">{plant.species}</p>}
          </div>
          <div className="flex shrink-0 gap-1">
            <Link href={`/plantas/${plant.id}/editar`}>
              <IconButton aria-label="Editar planta">
                <Pencil className="size-4" aria-hidden />
              </IconButton>
            </Link>
            <IconButton aria-label="Excluir planta" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-4" aria-hidden />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-moss-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-moss-600">
            Última adubação
          </p>
          {activeCycle?.lastApplicationDate ? (
            <>
              <p className="mt-1 font-medium text-stone-900">{product?.name}</p>
              <p className="text-sm text-stone-600">
                {formatDaysSince(activeCycle.lastApplicationDate, today)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-stone-500">Nenhum registro ainda</p>
          )}
        </div>
        <div className="rounded-xl bg-stone-100 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Próximo manejo
          </p>
          {activeCycle?.nextApplicationDate ? (
            <p className="mt-1 font-medium text-stone-900">
              {formatDaysUntil(activeCycle.nextApplicationDate, today)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-stone-500">Sem ciclo ativo</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setApplicationOpen(true)}>
          <Droplet className="size-4" aria-hidden />
          Registrar aplicação
        </Button>
        <PhotoUploader plantId={plantId} onUploaded={refreshAll} />
        <Button variant="secondary" size="sm" onClick={() => setCycleOpen(true)}>
          <Repeat className="size-4" aria-hidden />
          Criar ciclo
        </Button>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-stone-900">Fotos</h2>
          {photos && photos.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                setComparing((c) => !c);
                setSelected([]);
              }}
              className="text-sm font-medium text-moss-700"
            >
              {comparing ? "Cancelar" : "Comparar"}
            </button>
          )}
        </div>

        {comparing && (
          <p className="text-sm text-stone-500">
            Selecione duas fotos para ver a evolução ({selected.length}/2)
          </p>
        )}

        {selectedPhotos && (
          <PhotoCompare before={selectedPhotos.before} after={selectedPhotos.after} />
        )}

        {photos && photos.length > 0 ? (
          <PhotoGrid
            photos={photos}
            selectable={comparing}
            selected={selected}
            onToggleSelect={toggleSelect}
          />
        ) : (
          <EmptyState title="Nenhuma foto ainda" description="Adicione a primeira foto desta planta." />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-lg text-stone-900">Histórico</h2>
        {timeline && timeline.length > 0 ? (
          <PlantTimeline entries={timeline} />
        ) : (
          <EmptyState title="Ainda sem histórico" description="Fotos e aplicações aparecerão aqui." />
        )}
      </section>

      <ResponsiveDialog
        open={applicationOpen}
        onClose={() => setApplicationOpen(false)}
        title="Registrar aplicação"
      >
        <ApplicationForm
          initialTarget={{ type: "plant", id: plantId }}
          onSuccess={() => {
            setApplicationOpen(false);
            refreshAll();
          }}
        />
      </ResponsiveDialog>

      <ResponsiveDialog open={cycleOpen} onClose={() => setCycleOpen(false)} title="Criar ciclo">
        <CycleForm initialTarget={{ type: "plant", id: plantId }} />
      </ResponsiveDialog>

      <ConfirmDialog
        open={deleteOpen}
        title="Excluir planta?"
        description="Isso remove a planta, mas o histórico de aplicações é mantido."
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
