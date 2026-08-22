import type { Application, Photo, Product } from "@/types/entities";
import type { TimelineEntry } from "@/types/view-models";

export function buildTimeline(
  photos: Photo[],
  applications: (Application & { product?: Product })[]
): TimelineEntry[] {
  const photoEntries: TimelineEntry[] = photos.map((photo) => ({
    type: "photo",
    date: photo.createdAt,
    photo,
  }));

  const applicationEntries: TimelineEntry[] = applications.map(
    (application) => ({
      type: "application",
      date: application.date,
      application,
    })
  );

  return [...photoEntries, ...applicationEntries].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}
