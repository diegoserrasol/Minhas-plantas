"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end">
      <div
        className="absolute inset-0 bg-stone-900/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[85vh] w-full flex-col rounded-t-xl bg-stone-50 pb-[env(safe-area-inset-bottom)] shadow-card"
      >
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-stone-300" />
        <div className="overflow-y-auto px-5 pb-6 pt-4">
          {title && (
            <h2 className="mb-4 font-serif text-xl text-stone-900">{title}</h2>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
