"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { useRecommendations } from "@/hooks/useRecommendations";
import type { ProductType, Recommendation } from "@/types/entities";

const evidenceLabel: Record<Recommendation["evidenceLevel"], string> = {
  alto: "Evidência alta",
  medio: "Evidência média",
  baixo: "Evidência baixa",
};

export function RecommendationPicker({
  productType,
  onSelect,
}: {
  productType: ProductType | null;
  onSelect: (recommendation: Recommendation) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: recommendations, loading } = useRecommendations(
    open ? productType : null
  );

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={!productType}
        onClick={() => setOpen(true)}
      >
        <BookOpen className="size-4" aria-hidden />
        Usar recomendação
      </Button>

      <ResponsiveDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Sugestões baseadas na literatura"
      >
        {loading && <p className="py-6 text-sm text-stone-500">Carregando...</p>}

        {!loading && recommendations?.length === 0 && (
          <EmptyState
            title="Nenhuma recomendação disponível ainda"
            description="Defina o ciclo manualmente por enquanto — a biblioteca científica ainda está sendo construída."
          />
        )}

        <div className="flex flex-col gap-3">
          {recommendations?.map((rec) => (
            <button
              key={rec.id}
              type="button"
              onClick={() => {
                onSelect(rec);
                setOpen(false);
              }}
              className="rounded-lg border border-stone-200 p-4 text-left hover:border-moss-400"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="font-medium text-stone-900">{rec.speciesOrCategory}</p>
                <Badge tone="neutral">{evidenceLabel[rec.evidenceLevel]}</Badge>
              </div>
              <p className="text-sm text-stone-600">
                {rec.doseMin}–{rec.doseMax} {rec.unit} · a cada {rec.frequencyValue}{" "}
                {rec.frequencyUnit}
              </p>
              <p className="mt-1 text-xs text-stone-400">Fonte: {rec.source}</p>
            </button>
          ))}
        </div>
      </ResponsiveDialog>
    </>
  );
}
