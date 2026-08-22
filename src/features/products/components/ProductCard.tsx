import { FlaskConical, Leaf } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/types/entities";

export function ProductCard({ product }: { product: Product }) {
  const Icon = product.type === "mineral" ? FlaskConical : Leaf;

  return (
    <Link
      href={`/produtos/${product.id}/editar`}
      className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 shadow-soft transition-shadow hover:shadow-card"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-moss-100 text-moss-700">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-stone-900">{product.name}</p>
        {product.manufacturer && (
          <p className="truncate text-sm text-stone-500">{product.manufacturer}</p>
        )}
      </div>
      <Badge tone={product.type === "mineral" ? "neutral" : "moss"}>
        {product.type === "mineral" ? "Mineral" : "Biológico"}
      </Badge>
    </Link>
  );
}
