"use client";

import { LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/services/firebase/auth";

export default function ConfigPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-stone-900">Configurações</h1>

      {user && (
        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <Avatar src={user.photoURL} name={user.displayName ?? "Você"} size={48} />
          <div>
            <p className="font-medium text-stone-900">{user.displayName}</p>
            <p className="text-sm text-stone-500">{user.email}</p>
          </div>
        </div>
      )}

      <Button variant="secondary" onClick={() => signOutUser()}>
        <LogOut className="size-4" aria-hidden />
        Sair
      </Button>
    </div>
  );
}
