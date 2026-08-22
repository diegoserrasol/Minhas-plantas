import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import type { Photo } from "@/types/entities";

export function PhotoCompareSideBySide({
  before,
  after,
}: {
  before: Photo;
  after: Photo;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { photo: before, label: "Antes" },
        { photo: after, label: "Depois" },
      ].map(({ photo, label }) => (
        <div key={photo.id} className="flex flex-col gap-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-200">
            <Image src={photo.url} alt={label} fill sizes="350px" className="object-cover" />
          </div>
          <p className="text-center text-xs text-stone-500">
            {label} · {format(photo.createdAt, "dd MMM yyyy", { locale: ptBR })}
          </p>
        </div>
      ))}
    </div>
  );
}
