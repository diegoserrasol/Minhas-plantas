"use client";

import { use } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Spinner } from "@/components/ui/Spinner";
import { GroupForm } from "@/features/groups/components/GroupForm";
import { useGroup } from "@/hooks/useGroups";

export default function EditGroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const { data: group, loading, error } = useGroup(groupId);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl text-stone-900">Editar grupo</h1>
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}
      {error && <ErrorState />}
      {group && <GroupForm group={group} />}
    </div>
  );
}
