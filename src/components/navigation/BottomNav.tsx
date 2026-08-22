"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { FabRegister } from "./FabRegister";

export function BottomNav() {
  const pathname = usePathname();
  const [left, right] = [
    primaryNavItems.slice(0, 2),
    primaryNavItems.slice(2),
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-between border-t border-stone-200 bg-stone-50/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {left.map((item) => (
        <NavLink key={item.href} item={item} active={pathname === item.href} />
      ))}
      <div className="flex flex-1 items-center justify-center">
        <FabRegister />
      </div>
      {right.map((item) => (
        <NavLink key={item.href} item={item} active={pathname === item.href} />
      ))}
    </nav>
  );
}

function NavLink({
  item,
  active,
}: {
  item: (typeof primaryNavItems)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors",
        active ? "text-moss-700" : "text-stone-400"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-5" aria-hidden />
      {item.label}
    </Link>
  );
}
