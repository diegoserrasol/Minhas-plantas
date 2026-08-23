"use client";

import { Camera, ImageIcon, Sprout, Trash2 } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { useToast } from "@/components/feedback/ToastProvider";
import { Button } from "@/components/ui/Button";
import { describeError } from "@/lib/errors";
import { compressImageToDataUrl } from "@/lib/imageCompression";
import { cn } from "@/lib/utils";

export interface PhotoPickerProps {
  /** Data URI already compressed, or `undefined` when there's no photo. */
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Camera and gallery are two separate file inputs on purpose: a single
 * input with `capture="environment"` makes mobile browsers open the camera
 * and *never* offer the gallery, which is why existing photos couldn't be
 * attached at all on the phone.
 *
 * The picker hands back a finished data URI rather than a File — the value
 * shown in the preview is byte-for-byte what gets written to Firestore, so
 * compression failures surface here instead of at save time.
 */
export function PhotoPicker({
  value,
  onChange,
  label = "Foto (opcional)",
  disabled,
  className,
}: PhotoPickerProps) {
  const { showToast } = useToast();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const id = useId();

  async function handleFile(
    file: File | null,
    input: HTMLInputElement | null
  ) {
    // Reset first: picking the same file twice in a row fires no change
    // event otherwise.
    if (input) input.value = "";
    if (!file) return;

    setProcessing(true);
    try {
      onChange(await compressImageToDataUrl(file));
    } catch (error) {
      showToast(describeError(error, "Não foi possível processar a foto."), "error");
    } finally {
      setProcessing(false);
    }
  }

  const busy = disabled || processing;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium text-stone-700" id={`${id}-label`}>
        {label}
      </span>

      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-stone-200 bg-moss-50"
        aria-labelledby={`${id}-label`}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Pré-visualização da foto"
              fill
              sizes="(min-width: 768px) 400px, 100vw"
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onChange(undefined)}
              disabled={busy}
              aria-label="Remover foto"
              className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-status-overdue text-stone-50 shadow-soft disabled:opacity-50"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </>
        ) : (
          <div className="flex size-full items-center justify-center text-moss-400">
            <Sprout className="size-10" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth
          loading={processing}
          disabled={busy}
          onClick={() => cameraRef.current?.click()}
        >
          <Camera className="size-4" aria-hidden />
          Câmera
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth
          disabled={busy}
          onClick={() => galleryRef.current?.click()}
        >
          <ImageIcon className="size-4" aria-hidden />
          Galeria
        </Button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null, e.target)}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null, e.target)}
      />
    </div>
  );
}
