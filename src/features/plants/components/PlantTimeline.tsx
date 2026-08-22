import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Camera, Droplet } from "lucide-react";
import Image from "next/image";
import type { TimelineEntry } from "@/types/view-models";

const methodLabels: Record<string, string> = {
  solo: "Solo",
  foliar: "Foliar",
  agua: "Água/irrigação",
  outro: "Outro",
};

function groupByDay(entries: TimelineEntry[]) {
  const groups: { date: Date; entries: TimelineEntry[] }[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && isSameDay(last.date, entry.date)) {
      last.entries.push(entry);
    } else {
      groups.push({ date: entry.date, entries: [entry] });
    }
  }
  return groups;
}

export function PlantTimeline({ entries }: { entries: TimelineEntry[] }) {
  const groups = groupByDay(entries);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.date.toISOString()} className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            {format(group.date, "dd MMM yyyy", { locale: ptBR })}
          </p>
          <div className="flex flex-col gap-3 border-l border-stone-200 pl-4">
            {group.entries.map((entry, i) =>
              entry.type === "photo" && entry.photo ? (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                    <Camera className="size-3.5" aria-hidden />
                  </span>
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={entry.photo.url}
                      alt="Foto adicionada"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-stone-600">Foto adicionada</p>
                </div>
              ) : entry.application ? (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-moss-100 text-moss-700">
                    <Droplet className="size-3.5" aria-hidden />
                  </span>
                  <p className="text-sm text-stone-700">
                    <span className="font-medium">
                      {entry.application.product?.name ?? "Aplicação"}
                    </span>
                    {entry.application.dose && entry.application.unit && (
                      <> · {entry.application.dose} {entry.application.unit}</>
                    )}
                    {entry.application.method && (
                      <> · {methodLabels[entry.application.method]}</>
                    )}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
