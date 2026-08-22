import { ApplicationForm } from "@/features/applications/components/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl text-stone-900">Registrar aplicação</h1>
      <ApplicationForm />
    </div>
  );
}
