"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BottomSheet } from "./BottomSheet";
import { Modal } from "./Modal";

export interface ResponsiveDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Mobile gets a BottomSheet, desktop gets a Modal — same content, same
 * form component, only the container changes (PRD §25). Only one is
 * ever mounted, so form fields never end up duplicated in the DOM.
 */
export function ResponsiveDialog({
  open,
  onClose,
  title,
  children,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const Container = isDesktop ? Modal : BottomSheet;

  return (
    <Container open={open} onClose={onClose} title={title}>
      {children}
    </Container>
  );
}
