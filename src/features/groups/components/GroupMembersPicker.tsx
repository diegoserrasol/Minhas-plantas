"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Button } from "@/components/ui/Button";
import {
  addPlantToGroup,
  removePlantFromGroup,
} from "@/features/groups/useCases/groupUseCases";
import { PlantPhoto } from "@/features/plants/components/PlantPhoto";
import { useAuth } from "@/hooks/useAuth";
import { usePlants } from "@/hooks/usePlants";
import { cn } from "@/lib/utils";

export function GroupMembersPicker({
  groupId,
  memberIds,
  onChange,
}: {
  groupId: string;
  memberIds: string[];
  onChange: () => void;
}) {
  const { user } = useAuth();
  const { data: allPlants } = usePlants();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  async function toggle(plantId: string, isMember: boolean) {
    if (!user) return;
    setPending(plantId);
    try {
      if (isMember) {
        await removePlantFromGroup(user.uid, plantId);
      } else {
        await addPlantToGroup(user.uid, plantId, groupId);
      }
      onChange();
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Gerenciar plantas
      </Button>

      <ResponsiveDialog open={open} onClose={() => setOpen(false)} title="Plantas do grupo">
        <div className="flex flex-col gap-1">
          {allPlants?.length === 0 && (
            <p className="py-4 text-sm text-stone-500">
              Você ainda não tem plantas cadastradas.
            </p>
          )}
          {allPlants?.map((plant) => {
            const isMember = memberIds.includes(plant.id);
            return (
              <button
                key={plant.id}
                type="button"
                disabled={pending === plant.id}
                onClick={() => toggle(plant.id, isMember)}
                className="flex items-center gap-3 rounded-md px-2 py-2.5 text-left hover:bg-stone-100 disabled:opacity-50"
              >
                <PlantPhoto
                  src={plant.coverPhotoUrl}
                  alt={plant.name}
                  className="size-10 shrink-0 rounded-md"
                  sizes="40px"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-stone-800">
                  {plant.name}
                </span>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border",
                    isMember
                      ? "border-moss-600 bg-moss-600 text-stone-50"
                      : "border-stone-300"
                  )}
                >
                  {isMember && <Check className="size-3.5" aria-hidden />}
                </span>
              </button>
            );
          })}
        </div>
      </ResponsiveDialog>
    </>
  );
}
