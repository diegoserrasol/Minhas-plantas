"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Photo } from "@/types/entities";
import { PhotoCompareSideBySide } from "./PhotoCompareSideBySide";
import { PhotoCompareSlider } from "./PhotoCompareSlider";

export function PhotoCompare({ before, after }: { before: Photo; after: Photo }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? (
    <PhotoCompareSideBySide before={before} after={after} />
  ) : (
    <PhotoCompareSlider before={before} after={after} />
  );
}
