"use client";

import { Pause, Play, Repeat, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { formatDaysUntil } from "@/domain/care/careUrgency";
import { todayLocalDate } from "@/lib/date";
import type { CareCycle, Product } from "@/types/entities";

const frequencyLabel = (cycle: CareCycle) =>
  `a cada ${cycle.frequencyValue} ${cycle.frequencyUnit}`;

export function CycleCard({
  cycle,
  product,
  targetName,
  onPause,
  onReactivate,
  onDelete,
}: {
  cycle: CareCycle;
  product?: Product;
  targetName?: string;
  onPause: () => void;
  onReactivate: () => void;
  onDelete: () => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const today = todayLocalDate();

  return (
    <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-moss-100 text-moss-700">
        <Repeat className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-stone-900">
          {targetName ?? "—"} · {product?.name ?? "Produto"}
        </p>
        <p className="text-sm text-stone-500">{frequencyLabel(cycle)}</p>
        <div className="mt-1 flex items-center gap-2">
          <Badge tone={cycle.status === "ativo" ? "moss" : "neutral"}>
            {cycle.status === "ativo" ? "Ativo" : "Pausado"}
          </Badge>
          {cycle.nextApplicationDate && (
            <span className="text-xs text-stone-500">
              Próxima {formatDaysUntil(cycle.nextApplicationDate, today)}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        {cycle.status === "ativo" ? (
          <IconButton aria-label="Pausar ciclo" onClick={onPause}>
            <Pause className="size-4" aria-hidden />
          </IconButton>
        ) : (
          <IconButton aria-label="Reativar ciclo" onClick={onReactivate}>
            <Play className="size-4" aria-hidden />
          </IconButton>
        )}
        <IconButton
          aria-label="Excluir ciclo"
          onClick={() => setConfirmingDelete(true)}
        >
          <Trash2 className="size-4" aria-hidden />
        </IconButton>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Excluir ciclo?"
        description="O histórico de aplicações vinculado a ele será mantido."
        confirmLabel="Excluir"
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete();
        }}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
