import { ProductForm } from "@/features/products/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl text-stone-900">Novo produto</h1>
      <ProductForm />
    </div>
  );
}
