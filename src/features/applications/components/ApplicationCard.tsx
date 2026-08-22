import { Droplet } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Application } from "@/types/entities";

const methodLabels: Record<string, string> = {
  solo: "Solo",
  foliar: "Foliar",
  agua: "Água/irrigação",
  outro: "Outro",
};

export function ApplicationCard({
  application,
  productName,
  targetName,
}: {
  application: Application;
  productName?: string;
  targetName?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-moss-100 text-moss-700">
        <Droplet className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-stone-500">
          {format(application.date, "dd MMM yyyy", { locale: ptBR })}
        </p>
        <p className="font-medium text-stone-900">
          {targetName ?? "Planta"} · {productName ?? "Produto"}
        </p>
        <p className="text-sm text-stone-500">
          {[
            application.dose && application.unit
              ? `${application.dose} ${application.unit}`
              : null,
            application.method ? methodLabels[application.method] : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </div>
  );
}
