import type { LucideIcon } from "lucide-react";
import { Sprout } from "lucide-react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon = Sprout,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-100/50 px-6 py-12 text-center">
      <Icon className="size-8 text-moss-500" aria-hidden />
      <p className="text-base font-medium text-stone-800">{title}</p>
      {description && <p className="text-sm text-stone-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
