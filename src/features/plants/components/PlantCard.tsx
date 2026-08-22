import Link from "next/link";
import { formatDaysSince, formatDaysUntil } from "@/domain/care/careUrgency";
import { Badge } from "@/components/ui/Badge";
import { todayLocalDate } from "@/lib/date";
import type { PlantWithCareStatus } from "@/types/view-models";
import { PlantPhoto } from "./PlantPhoto";

const urgencyTone = {
  atrasado: "overdue",
  hoje: "today",
  proximo: "upcoming",
} as const;

export function PlantCard({ plant }: { plant: PlantWithCareStatus }) {
  const today = todayLocalDate();

  return (
    <Link
      href={`/plantas/${plant.id}`}
      className="flex gap-4 rounded-xl border border-stone-200 bg-stone-50 p-3 shadow-soft transition-shadow hover:shadow-card"
    >
      <PlantPhoto
        src={plant.coverPhotoUrl}
        alt={plant.name}
        className="size-20 shrink-0 rounded-lg"
        sizes="80px"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <p className="truncate font-medium text-stone-900">{plant.name}</p>
        {plant.species && (
          <p className="truncate text-sm text-stone-500">{plant.species}</p>
        )}

        {plant.lastApplicationDate ? (
          <p className="text-sm font-medium text-stone-700">
            {plant.lastApplicationProduct?.name ?? "Adubação"} ·{" "}
            {formatDaysSince(plant.lastApplicationDate, today)}
          </p>
        ) : (
          <p className="text-sm text-stone-400">Sem manejo registrado</p>
        )}

        {plant.activeCycle?.nextApplicationDate && plant.urgency && (
          <Badge tone={urgencyTone[plant.urgency]} className="mt-0.5 w-fit">
            Próxima {formatDaysUntil(plant.activeCycle.nextApplicationDate, today)}
          </Badge>
        )}
      </div>
    </Link>
  );
}
