"use client";

import { Camera, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/components/feedback/ToastProvider";
import { Button } from "@/components/ui/Button";
import { addPlantPhoto } from "@/features/photos/useCases/photoUseCases";
import { useAuth } from "@/hooks/useAuth";
import { describeError } from "@/lib/errors";
import { compressImageToDataUrl } from "@/lib/imageCompression";

/**
 * Two inputs, not one: a lone `capture="environment"` input opens the
 * camera on mobile and never offers the gallery, so photos already on the
 * phone couldn't be added to a plant at all.
 */
export function PhotoUploader({
  plantId,
  onUploaded,
}: {
  plantId: string;
  onUploaded: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | null, input: HTMLInputElement | null) {
    // Reset first so re-picking the same file still fires a change event.
    if (input) input.value = "";
    if (!file || !user) return;

    setUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      await addPlantPhoto(user.uid, plantId, dataUrl);
      showToast("Foto adicionada 📷");
      onUploaded();
    } catch (error) {
      showToast(describeError(error, "Não foi possível enviar a foto."), "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
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

      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={uploading}
        onClick={() => cameraRef.current?.click()}
      >
        <Camera className="size-4" aria-hidden />
        Câmera
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={uploading}
        onClick={() => galleryRef.current?.click()}
      >
        <ImageIcon className="size-4" aria-hidden />
        Galeria
      </Button>
    </>
  );
}
