"use client";

import { Droplet, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Spinner } from "@/components/ui/Spinner";
import { ApplicationForm } from "@/features/applications/components/ApplicationForm";
import { GroupMembersPicker } from "@/features/groups/components/GroupMembersPicker";
import { deleteGroup } from "@/features/groups/useCases/groupUseCases";
import { PlantCard } from "@/features/plants/components/PlantCard";
import { PlantPhoto } from "@/features/plants/components/PlantPhoto";
import { useAuth } from "@/hooks/useAuth";
import { useGroup } from "@/hooks/useGroups";
import { usePlantsWithCareStatus } from "@/hooks/usePlantsWithCareStatus";

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const { data: group, loading, error } = useGroup(groupId);
  const { data: plantsData, refetch: refetchPlants } = usePlantsWithCareStatus();

  const [applicationOpen, setApplicationOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const members = plantsData?.plants.filter((p) => p.groupId === groupId) ?? [];

  async function handleDelete() {
    if (!user) return;
    await deleteGroup(user.uid, groupId);
    router.push("/grupos");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error || !group) {
    return <ErrorState message="Não foi possível carregar este grupo." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <PlantPhoto
            src={group.coverPhotoUrl}
            alt={group.name}
            className="size-14 shrink-0 rounded-lg"
            sizes="56px"
          />
          <div className="min-w-0">
            <h1 className="font-serif text-2xl text-stone-900">{group.name}</h1>
            {group.description && <p className="text-sm text-stone-500">{group.description}</p>}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Link href={`/grupos/${groupId}/editar`}>
            <IconButton aria-label="Editar grupo">
              <Pencil className="size-4" aria-hidden />
            </IconButton>
          </Link>
          <IconButton aria-label="Excluir grupo" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="size-4" aria-hidden />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setApplicationOpen(true)}>
          <Droplet className="size-4" aria-hidden />
          Aplicar para o grupo
        </Button>
        <GroupMembersPicker
          groupId={groupId}
          memberIds={members.map((m) => m.id)}
          onChange={refetchPlants}
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-lg text-stone-900">Plantas do grupo</h2>
        {members.length === 0 ? (
          <EmptyState title="Nenhuma planta neste grupo ainda" />
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </section>

      <ResponsiveDialog
        open={applicationOpen}
        onClose={() => setApplicationOpen(false)}
        title="Aplicar para o grupo"
      >
        <ApplicationForm
          initialTarget={{ type: "group", id: groupId }}
          onSuccess={() => {
            setApplicationOpen(false);
            refetchPlants();
          }}
        />
      </ResponsiveDialog>

      <ConfirmDialog
        open={deleteOpen}
        title="Excluir grupo?"
        description="As plantas permanecem, apenas o agrupamento é removido."
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
