"use client";

import { use } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Spinner } from "@/components/ui/Spinner";
import { ProductForm } from "@/features/products/components/ProductForm";
import { useProduct } from "@/hooks/useProduct";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const { data: product, loading, error } = useProduct(productId);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl text-stone-900">Editar produto</h1>
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}
      {error && <ErrorState />}
      {product && <ProductForm product={product} />}
    </div>
  );
}
