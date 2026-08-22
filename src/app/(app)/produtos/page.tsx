"use client";

import { FlaskConical, Plus } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const { data, loading, error, refetch } = useProducts();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-stone-900">Produtos</h1>
        <Link
          href="/produtos/novo"
          className="flex items-center gap-1.5 rounded-full bg-moss-600 px-4 py-2 text-sm font-medium text-stone-50 shadow-soft hover:bg-moss-700"
        >
          <Plus className="size-4" aria-hidden />
          Novo
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {!loading && !error && data?.length === 0 && (
        <EmptyState
          icon={FlaskConical}
          title="Nenhum produto cadastrado"
          description="Cadastre fertilizantes minerais ou bioinsumos que você usa."
          action={
            <Link
              href="/produtos/novo"
              className="text-sm font-medium text-moss-700 underline underline-offset-2"
            >
              Adicionar produto
            </Link>
          }
        />
      )}

      <div className="flex flex-col gap-3">
        {data?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
