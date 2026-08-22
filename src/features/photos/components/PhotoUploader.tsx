"use client";

import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/components/feedback/ToastProvider";
import { Button } from "@/components/ui/Button";
import { addPlantPhoto } from "@/features/photos/useCases/photoUseCases";
import { useAuth } from "@/hooks/useAuth";

export function PhotoUploader({
  plantId,
  onUploaded,
}: {
  plantId: string;
  onUploaded: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | null) {
    if (!file || !user) return;
    setUploading(true);
    try {
      await addPlantPhoto(user.uid, plantId, file);
      showToast("Foto adicionada 📷");
      onUploaded();
    } catch {
      showToast("Não foi possível enviar a foto.", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="size-4" aria-hidden />
        Nova foto
      </Button>
    </>
  );
}
