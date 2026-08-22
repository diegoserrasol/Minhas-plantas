"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/feedback/ToastProvider";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { registerApplication } from "@/features/applications/useCases/registerApplication";
import { useAuth } from "@/hooks/useAuth";
import { useCyclesForGroup, useCyclesForPlant } from "@/hooks/useCycles";
import { useGroups } from "@/hooks/useGroups";
import { usePlants } from "@/hooks/usePlants";
import { useProducts } from "@/hooks/useProducts";
import { parseLocalDate, toDateInputValue, todayLocalDate } from "@/lib/date";
import type { MethodType, UnitType } from "@/types/entities";

const methodOptions: { value: MethodType; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "foliar", label: "Foliar" },
  { value: "agua", label: "Água" },
  { value: "outro", label: "Outro" },
];

const unitOptions: UnitType[] = ["mL/L", "mL", "g/L", "g", "mg/L", "outro"];

const schema = z.object({
  targetType: z.enum(["plant", "group"]),
  targetId: z.string().min(1, "Selecione uma planta ou grupo"),
  productId: z.string().min(1, "Selecione um produto"),
  date: z.string().min(1),
  dose: z.string().optional(),
  unit: z.string().optional(),
  volume: z.string().optional(),
  method: z.enum(["solo", "foliar", "agua", "outro"]).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export interface ApplicationFormProps {
  initialTarget?: { type: "plant" | "group"; id: string };
  initialProductId?: string;
  onSuccess?: () => void;
}

export function ApplicationForm({
  initialTarget,
  initialProductId,
  onSuccess,
}: ApplicationFormProps) {
  const { user } = useAuth();
  const { data: plants } = usePlants();
  const { data: groups } = useGroups();
  const { data: products } = useProducts();
  const { showToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [method, setMethod] = useState<MethodType>("solo");

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
      productId: initialProductId ?? "",
      date: toDateInputValue(todayLocalDate()),
      method: "solo",
    },
  });

  const targetType = watch("targetType");
  const targetId = watch("targetId");
  const productId = watch("productId");

  // The product <select>'s options render only once useProducts() resolves
  // — after that, react-hook-form's mount-time defaultValues can no longer
  // retroactively select an option that didn't exist in the DOM yet, so
  // re-apply once the data is in. (targetId has no such issue: when
  // initialTarget is set, its <select> is hidden entirely, so there's no
  // DOM option list to race against.)
  useEffect(() => {
    if (initialProductId && products?.some((p) => p.id === initialProductId)) {
      setValue("productId", initialProductId);
    }
  }, [initialProductId, products, setValue]);

  const { data: plantCycles } = useCyclesForPlant(
    targetType === "plant" ? targetId : ""
  );
  const { data: groupCycles } = useCyclesForGroup(
    targetType === "group" ? targetId : ""
  );

  const matchingCycle = useMemo(() => {
    const cycles = targetType === "plant" ? plantCycles : groupCycles;
    return cycles?.find(
      (c) => c.productId === productId && c.status === "ativo"
    );
  }, [targetType, plantCycles, groupCycles, productId]);

  async function onSubmit(values: FormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      await registerApplication({
        userId: user.uid,
        productId: values.productId,
        plantId: values.targetType === "plant" ? values.targetId : undefined,
        groupId: values.targetType === "group" ? values.targetId : undefined,
        date: parseLocalDate(values.date),
        dose: values.dose ? Number(values.dose) : undefined,
        unit: (values.unit as UnitType) || undefined,
        volume: values.volume ? Number(values.volume) : undefined,
        method,
        notes: values.notes || undefined,
        cycleId: matchingCycle?.id,
      });
      showToast("Aplicação registrada 🌱");
      onSuccess?.();
      router.push(
        values.targetType === "plant"
          ? `/plantas/${values.targetId}`
          : `/grupos/${values.targetId}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {!initialTarget && (
        <>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-700">Aplicar em</span>
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

      {matchingCycle && (
        <p className="rounded-md bg-moss-100 px-3 py-2 text-sm text-moss-800">
          Vinculado ao ciclo ativo — a próxima aplicação será recalculada.
        </p>
      )}

      <DatePicker label="Data" {...register("date")} />

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
          onChange={(value) => {
            setMethod(value);
            setValue("method", value);
          }}
          options={methodOptions}
        />
      </div>

      <Textarea label="Observação (opcional)" {...register("notes")} />

      <Button type="submit" size="lg" fullWidth loading={submitting}>
        Registrar aplicação
      </Button>
    </form>
  );
}
