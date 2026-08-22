import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar />
      <main className="min-h-screen pb-24 md:ml-60 md:pb-8">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-10">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
