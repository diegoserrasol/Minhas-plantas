"use client";

import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { GroupCard } from "@/features/groups/components/GroupCard";
import { useGroups } from "@/hooks/useGroups";
import { usePlants } from "@/hooks/usePlants";

export default function GroupsPage() {
  const { data: groups, loading, error, refetch } = useGroups();
  const { data: plants } = usePlants();

  const memberCount = (groupId: string) =>
    plants?.filter((p) => p.groupId === groupId).length ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-stone-900">Grupos</h1>
        <Link
          href="/grupos/novo"
          className="flex items-center gap-1.5 rounded-full bg-moss-600 px-4 py-2 text-sm font-medium text-stone-50 shadow-soft hover:bg-moss-700"
        >
          <Plus className="size-4" aria-hidden />
          Novo
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {!loading && !error && groups?.length === 0 && (
        <EmptyState
          icon={Users}
          title="Nenhum grupo criado"
          description="Organize plantas que recebem o mesmo manejo, como Suculentas ou Varanda."
          action={
            <Link
              href="/grupos/novo"
              className="text-sm font-medium text-moss-700 underline underline-offset-2"
            >
              Criar grupo
            </Link>
          }
        />
      )}

      <div className="flex flex-col gap-3">
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} memberCount={memberCount(group.id)} />
        ))}
      </div>
    </div>
  );
}
