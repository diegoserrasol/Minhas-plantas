import { Users } from "lucide-react";
import Link from "next/link";
import { PlantPhoto } from "@/features/plants/components/PlantPhoto";
import type { Group } from "@/types/entities";

export function GroupCard({
  group,
  memberCount,
}: {
  group: Group;
  memberCount: number;
}) {
  return (
    <Link
      href={`/grupos/${group.id}`}
      className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4 shadow-soft transition-shadow hover:shadow-card"
    >
      <PlantPhoto
        src={group.coverPhotoUrl}
        alt={group.name}
        className="size-14 shrink-0 rounded-lg"
        sizes="56px"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-stone-900">{group.name}</p>
        <p className="flex items-center gap-1 text-sm text-stone-500">
          <Users className="size-3.5" aria-hidden />
          {memberCount} {memberCount === 1 ? "planta" : "plantas"}
        </p>
      </div>
    </Link>
  );
}
