import { GroupForm } from "@/features/groups/components/GroupForm";

export default function NewGroupPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-2xl text-stone-900">Novo grupo</h1>
      <GroupForm />
    </div>
  );
}
