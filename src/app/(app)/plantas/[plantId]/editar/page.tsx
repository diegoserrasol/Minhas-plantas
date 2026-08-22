"use client";

import { use } from "react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Spinner } from "@/components/ui/Spinner";
import { PlantForm } from "@/features/plants/components/PlantForm";
import { usePlant } from "@/hooks/usePlant";

export default function EditPlantPage({
  params,
}: {
  params: Promise<{ plantId: string }>;
}) {
  const { plantId } = use(params);
  const { data: plant, loading, error } = usePlant(plantId);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl text-stone-900">Editar planta</h1>
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}
      {error && <ErrorState />}
      {plant && <PlantForm plant={plant} />}
    </div>
  );
}
