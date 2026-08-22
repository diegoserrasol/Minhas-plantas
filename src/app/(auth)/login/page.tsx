"use client";

import { Sprout } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle } from "@/services/firebase/auth";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  async function handleSignIn() {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Não foi possível entrar. Tente novamente.");
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-stone-50 px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="flex size-16 items-center justify-center rounded-full bg-moss-100">
          <Sprout className="size-8 text-moss-600" aria-hidden />
        </span>
        <h1 className="font-serif text-3xl text-stone-900">Minhas Plantas</h1>
        <p className="max-w-xs text-sm text-stone-500">
          Controle simples e visual do manejo das suas plantas domésticas.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button
          onClick={handleSignIn}
          loading={signingIn}
          size="lg"
          fullWidth
        >
          Entrar com Google
        </Button>
        {error && <p className="text-sm text-status-overdue">{error}</p>}
      </div>
    </div>
  );
}
