import { PlantForm } from "@/features/plants/components/PlantForm";

export default function NewPlantPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl text-stone-900">Nova planta</h1>
      <PlantForm />
    </div>
  );
}
