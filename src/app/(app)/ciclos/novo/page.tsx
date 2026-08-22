import { CycleForm } from "@/features/cycles/components/CycleForm";

export default function NewCyclePage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl text-stone-900">Novo ciclo</h1>
      <CycleForm />
    </div>
  );
}
