"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/feedback/ToastProvider";
import { createPlant, updatePlant } from "@/features/plants/useCases/plantUseCases";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import type { Plant } from "@/types/entities";
import { PlantPhoto } from "./PlantPhoto";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(
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

  function handlePhotoChange(file: File | null) {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : plant?.coverPhotoUrl);
  }

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
      };

      if (plant) {
        await updatePlant(user.uid, plant.id, cleaned);
        showToast("Planta atualizada 🌿");
        router.push(`/plantas/${plant.id}`);
      } else {
        const created = await createPlant({
          userId: user.uid,
          ...cleaned,
          coverPhotoFile: photoFile ?? undefined,
        });
        showToast("Planta adicionada 🌱");
        router.push(`/plantas/${created.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex size-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-stone-300"
        >
          <PlantPhoto src={photoPreview} alt="Foto da planta" className="size-full" />
          <span className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-moss-600 text-stone-50">
            <Camera className="size-3.5" aria-hidden />
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-stone-400">Foto (opcional)</p>
      </div>

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
