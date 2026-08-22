import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Algo deu errado. Tente novamente em instantes.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-status-overdue/5 px-6 py-10 text-center">
      <AlertTriangle className="size-7 text-status-overdue" aria-hidden />
      <p className="text-sm text-stone-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
