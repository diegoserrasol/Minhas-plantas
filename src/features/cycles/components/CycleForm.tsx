"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/feedback/ToastProvider";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import { createCycle } from "@/features/cycles/useCases/cycleUseCases";
import { RecommendationPicker } from "@/features/cycles/components/RecommendationPicker";
import { useAuth } from "@/hooks/useAuth";
import { describeError } from "@/lib/errors";
import { useGroups } from "@/hooks/useGroups";
import { usePlants } from "@/hooks/usePlants";
import { useProducts } from "@/hooks/useProducts";
import { parseLocalDate, toDateInputValue, todayLocalDate } from "@/lib/date";
import type {
  FrequencyUnit,
  MethodType,
  ProductType,
  Recommendation,
  UnitType,
} from "@/types/entities";

const methodOptions: { value: MethodType; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "foliar", label: "Foliar" },
  { value: "agua", label: "Água" },
  { value: "outro", label: "Outro" },
];

const frequencyUnitOptions: { value: FrequencyUnit; label: string }[] = [
  { value: "dias", label: "Dias" },
  { value: "semanas", label: "Semanas" },
  { value: "meses", label: "Meses" },
];

const unitOptions: UnitType[] = ["mL/L", "mL", "g/L", "g", "mg/L", "outro"];

const schema = z.object({
  targetType: z.enum(["plant", "group"]),
  targetId: z.string().min(1, "Selecione uma planta ou grupo"),
  productId: z.string().min(1, "Selecione um produto"),
  dose: z.string().optional(),
  unit: z.string().optional(),
  volume: z.string().optional(),
  frequencyValue: z.string().min(1, "Informe a frequência"),
  frequencyUnit: z.enum(["dias", "semanas", "meses"]),
  startDate: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export interface CycleFormProps {
  initialTarget?: { type: "plant" | "group"; id: string };
}

export function CycleForm({ initialTarget }: CycleFormProps) {
  const { user } = useAuth();
  const { data: plants } = usePlants();
  const { data: groups } = useGroups();
  const { data: products } = useProducts();
  const { showToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [method, setMethod] = useState<MethodType>("solo");
  const [recommendationId, setRecommendationId] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetType: initialTarget?.type ?? "plant",
      targetId: initialTarget?.id ?? "",
      productId: "",
      frequencyUnit: "dias",
      startDate: toDateInputValue(todayLocalDate()),
    },
  });

  const targetType = watch("targetType");
  const productId = watch("productId");
  const selectedProductType: ProductType | null =
    products?.find((p) => p.id === productId)?.type ?? null;

  function applyRecommendation(rec: Recommendation) {
    setValue("dose", String((rec.doseMin + rec.doseMax) / 2));
    setValue("unit", rec.unit);
    setValue("frequencyValue", String(rec.frequencyValue));
    setValue("frequencyUnit", rec.frequencyUnit);
    setMethod(rec.method);
    setRecommendationId(rec.id);
  }

  async function onSubmit(values: FormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      await createCycle({
        userId: user.uid,
        plantId: values.targetType === "plant" ? values.targetId : undefined,
        groupId: values.targetType === "group" ? values.targetId : undefined,
        productId: values.productId,
        dose: values.dose ? Number(values.dose) : undefined,
        unit: (values.unit as UnitType) || undefined,
        volume: values.volume ? Number(values.volume) : undefined,
        method,
        frequencyValue: Number(values.frequencyValue),
        frequencyUnit: values.frequencyUnit,
        startDate: parseLocalDate(values.startDate),
        recommendationId,
      });
      showToast("Ciclo criado 🌱");
      router.push("/ciclos");
    } catch (error) {
      showToast(describeError(error, "Não foi possível criar o ciclo."), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {!initialTarget && (
        <>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-700">Para</span>
            <SegmentedControl
              aria-label="Planta ou grupo"
              value={targetType}
              onChange={(value) => setValue("targetType", value)}
              options={[
                { value: "plant", label: "Planta" },
                { value: "group", label: "Grupo" },
              ]}
            />
          </div>

          {targetType === "plant" ? (
            <Select label="Planta" error={errors.targetId?.message} {...register("targetId")}>
              <option value="">Selecione</option>
              {plants?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          ) : (
            <Select label="Grupo" error={errors.targetId?.message} {...register("targetId")}>
              <option value="">Selecione</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Select>
          )}
        </>
      )}

      <Select label="Produto" error={errors.productId?.message} {...register("productId")}>
        <option value="">Selecione</option>
        {products?.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      <RecommendationPicker
        productType={selectedProductType}
        onSelect={applyRecommendation}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Dose (opcional)" type="number" step="any" {...register("dose")} />
        <Select label="Unidade" {...register("unit")}>
          <option value="">—</option>
          {unitOptions.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
      </div>

      <Input label="Volume (opcional)" type="number" step="any" {...register("volume")} />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-700">Método</span>
        <SegmentedControl
          aria-label="Método de aplicação"
          value={method}
          onChange={setMethod}
          options={methodOptions}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Frequência"
          type="number"
          placeholder="Ex: 15"
          error={errors.frequencyValue?.message}
          {...register("frequencyValue")}
        />
        <Select label="A cada" {...register("frequencyUnit")}>
          {frequencyUnitOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      <DatePicker label="Data inicial" {...register("startDate")} />

      <Button type="submit" size="lg" fullWidth loading={submitting}>
        Criar ciclo
      </Button>
    </form>
  );
}
