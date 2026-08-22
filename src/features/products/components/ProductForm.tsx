"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/feedback/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Textarea } from "@/components/ui/Textarea";
import {
  createProduct,
  updateProduct,
} from "@/features/products/useCases/productUseCases";
import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@/types/entities";

const schema = z.object({
  name: z.string().min(1, "Dê um nome para o produto"),
  type: z.enum(["mineral", "biologico"]),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProductForm({ product }: { product?: Product }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<"mineral" | "biologico">(
    product?.type ?? "mineral"
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      type: product?.type ?? "mineral",
      manufacturer: product?.manufacturer ?? "",
      description: product?.description ?? "",
      notes: product?.notes ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      const cleaned = {
        name: values.name,
        type: values.type,
        manufacturer: values.manufacturer || undefined,
        description: values.description || undefined,
        notes: values.notes || undefined,
      };

      if (product) {
        await updateProduct(user.uid, product.id, cleaned);
        showToast("Produto atualizado 🌿");
      } else {
        await createProduct({ userId: user.uid, ...cleaned });
        showToast("Produto adicionado 🌱");
      }
      router.push("/produtos");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-700">Tipo</span>
        <SegmentedControl
          aria-label="Tipo de produto"
          value={type}
          onChange={(value) => {
            setType(value);
            setValue("type", value);
          }}
          options={[
            { value: "mineral", label: "Mineral" },
            { value: "biologico", label: "Biológico" },
          ]}
        />
      </div>

      <Input
        label="Nome"
        placeholder="Ex: NPK 10-10-10"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input label="Fabricante (opcional)" {...register("manufacturer")} />
      <Textarea label="Descrição (opcional)" {...register("description")} />
      <Textarea label="Observações (opcional)" {...register("notes")} />

      <Button type="submit" size="lg" fullWidth loading={submitting}>
        {product ? "Salvar alterações" : "Salvar produto"}
      </Button>
    </form>
  );
}
