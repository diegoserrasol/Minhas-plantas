"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/feedback/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createGroup, updateGroup } from "@/features/groups/useCases/groupUseCases";
import { useAuth } from "@/hooks/useAuth";
import type { Group } from "@/types/entities";

const schema = z.object({
  name: z.string().min(1, "Dê um nome para o grupo"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function GroupForm({ group }: { group?: Group }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: group?.name ?? "",
      description: group?.description ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      const cleaned = {
        name: values.name,
        description: values.description || undefined,
      };

      if (group) {
        await updateGroup(user.uid, group.id, cleaned);
        showToast("Grupo atualizado 🌿");
        router.push(`/grupos/${group.id}`);
      } else {
        const created = await createGroup({ userId: user.uid, ...cleaned });
        showToast("Grupo criado 🌱");
        router.push(`/grupos/${created.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Nome"
        placeholder="Ex: Suculentas"
        error={errors.name?.message}
        {...register("name")}
      />
      <Textarea label="Descrição (opcional)" {...register("description")} />
      <Button type="submit" size="lg" fullWidth loading={submitting}>
        {group ? "Salvar alterações" : "Criar grupo"}
      </Button>
    </form>
  );
}
