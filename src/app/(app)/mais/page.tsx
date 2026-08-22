import { ChevronRight, Settings } from "lucide-react";
import Link from "next/link";
import { secondaryNavItems } from "@/lib/navigation";

export default function MorePage() {
  return (
    <div className="flex flex-col gap-5 md:hidden">
      <h1 className="font-serif text-2xl text-stone-900">Mais</h1>
      <div className="flex flex-col divide-y divide-stone-200 rounded-xl border border-stone-200 bg-stone-50">
        {[...secondaryNavItems, { href: "/mais/config", label: "Configurações", icon: Settings }].map(
          (item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 text-stone-800"
              >
                <Icon className="size-4.5 text-stone-500" aria-hidden />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <ChevronRight className="size-4 text-stone-300" aria-hidden />
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}
