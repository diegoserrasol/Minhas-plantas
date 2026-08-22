"use client";

import { Droplet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { CareItem } from "@/types/view-models";
import { PlantPhoto } from "@/features/plants/components/PlantPhoto";

const toneClasses = {
  atrasado: "border-status-overdue/30 bg-status-overdue/5",
  hoje: "border-status-today/30 bg-status-today/5",
  proximo: "border-stone-200 bg-stone-50",
} as const;

export function CareCard({
  item,
  onApply,
}: {
  item: CareItem;
  onApply: () => void;
}) {
  const targetName = item.plant?.name ?? item.group?.name ?? "—";
  const href = item.plant ? `/plantas/${item.plant.id}` : `/grupos/${item.group?.id}`;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 ${toneClasses[item.urgency]}`}
    >
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
        <PlantPhoto
          src={item.plant?.coverPhotoUrl}
          alt={targetName}
          className="size-12 shrink-0 rounded-lg"
          sizes="48px"
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-stone-900">{targetName}</p>
          <p className="truncate text-sm text-stone-500">{item.product.name}</p>
        </div>
      </Link>
      <Button size="sm" variant="secondary" onClick={onApply}>
        <Droplet className="size-3.5" aria-hidden />
        Aplicar
      </Button>
    </div>
  );
}
