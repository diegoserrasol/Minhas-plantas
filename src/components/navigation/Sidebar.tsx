"use client";

import { Droplet, LogOut, Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { primaryNavItems, secondaryNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { signOutUser } from "@/services/firebase/auth";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const items = [...primaryNavItems.slice(0, 3), ...secondaryNavItems];

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-stone-200 bg-stone-50 p-5 md:flex">
      <div className="mb-8 flex items-center gap-2 px-1">
        <Sprout className="size-6 text-moss-600" aria-hidden />
        <span className="font-serif text-lg text-stone-900">Minhas Plantas</span>
      </div>

      <Link
        href="/aplicacoes/nova"
        className="mb-6 flex items-center justify-center gap-2 rounded-md bg-moss-600 px-4 py-2.5 text-sm font-medium text-stone-50 shadow-soft transition-colors hover:bg-moss-700"
      >
        <Droplet className="size-4" aria-hidden />
        Registrar aplicação
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-moss-100 text-moss-800"
                  : "text-stone-600 hover:bg-stone-100"
              )}
            >
              <Icon className="size-4.5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="flex items-center gap-3 border-t border-stone-200 pt-4">
          <Avatar src={user.photoURL} name={user.displayName ?? "Você"} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-800">
              {user.displayName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOutUser()}
            aria-label="Sair"
            className="rounded-md p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </aside>
  );
}
