"use client";

import { Camera, Plus, Sprout, Droplet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";

const quickActions = [
  { href: "/plantas/nova", label: "Adicionar planta", icon: Sprout },
  { href: "/aplicacoes/nova", label: "Registrar aplicação", icon: Droplet },
  { href: "/plantas?acao=foto", label: "Nova foto", icon: Camera },
];

export function FabRegister() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Registrar"
        className="flex size-14 -translate-y-4 items-center justify-center rounded-full bg-moss-600 text-stone-50 shadow-card transition-transform active:scale-95"
      >
        <Plus className="size-6" aria-hidden />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Registrar">
        <div className="flex flex-col gap-1">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3.5 text-base font-medium text-stone-800 hover:bg-stone-100"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-moss-100 text-moss-700">
                  <Icon className="size-5" aria-hidden />
                </span>
                {action.label}
              </Link>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}
