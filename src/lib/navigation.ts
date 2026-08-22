import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  FlaskConical,
  History,
  Home,
  MoreHorizontal,
  Repeat,
  Sprout,
  Users,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNavItems: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/plantas", label: "Plantas", icon: Sprout },
  { href: "/cuidados", label: "Cuidados", icon: CalendarCheck },
  { href: "/mais", label: "Mais", icon: MoreHorizontal },
];

export const secondaryNavItems: NavItem[] = [
  { href: "/grupos", label: "Grupos", icon: Users },
  { href: "/produtos", label: "Produtos", icon: FlaskConical },
  { href: "/ciclos", label: "Ciclos", icon: Repeat },
  { href: "/aplicacoes", label: "Histórico", icon: History },
];
