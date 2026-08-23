"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhotoPicker } from "@/components/ui/PhotoPicker";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/feedback/ToastProvider";
import { createPlant, updatePlant } from "@/features/plants/useCases/plantUseCases";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { describeError } from "@/lib/errors";
import type { Plant } from "@/types/entities";

const schema = z.object({
  name: z.string().min(1, "Dê um nome para a planta"),
  species: z.string().optional(),
  groupId: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PlantForm({ plant }: { plant?: Plant }) {
  const { user } = useAuth();
  const { data: groups } = useGroups();
  const { showToast } = useToast();
  const router = useRouter();
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | undefined>(
    plant?.coverPhotoUrl
  );
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: plant?.name ?? "",
      species: plant?.species ?? "",
      groupId: plant?.groupId ?? "",
      location: plant?.location ?? "",
      notes: plant?.notes ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) return;
    setSubmitting(true);
    try {
      const cleaned = {
        name: values.name,
        species: values.species || undefined,
        groupId: values.groupId || undefined,
        location: values.location || undefined,
        notes: values.notes || undefined,
        coverPhotoUrl,
      };

      if (plant) {
        await updatePlant(user.uid, plant.id, cleaned);
        showToast("Planta atualizada 🌿");
        router.push(`/plantas/${plant.id}`);
      } else {
        const created = await createPlant({ userId: user.uid, ...cleaned });
        showToast("Planta adicionada 🌱");
        router.push(`/plantas/${created.id}`);
      }
    } catch (error) {
      showToast(describeError(error, "Não foi possível salvar a planta."), "error");
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
        placeholder="Ex: Costela-de-adão"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input label="Espécie (opcional)" placeholder="Ex: Monstera deliciosa" {...register("species")} />

      <Select label="Grupo (opcional)" {...register("groupId")}>
        <option value="">Sem grupo</option>
        {groups?.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </Select>

      <Input label="Local (opcional)" placeholder="Ex: Sala, varanda..." {...register("location")} />

      <Textarea label="Observações (opcional)" {...register("notes")} />

      <Button type="submit" size="lg" fullWidth loading={submitting}>
        {plant ? "Salvar alterações" : "Salvar planta"}
      </Button>
    </form>
  );
}
