"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/feedback/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhotoPicker } from "@/components/ui/PhotoPicker";
import { Textarea } from "@/components/ui/Textarea";
import { createGroup, updateGroup } from "@/features/groups/useCases/groupUseCases";
import { useAuth } from "@/hooks/useAuth";
import { describeError } from "@/lib/errors";
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
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | undefined>(
    group?.coverPhotoUrl
  );

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
        coverPhotoUrl,
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
    } catch (error) {
      showToast(describeError(error, "Não foi possível salvar o grupo."), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <PhotoPicker
        value={coverPhotoUrl}
        onChange={setCoverPhotoUrl}
        label="Foto de capa (opcional)"
        disabled={submitting}
      />
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
