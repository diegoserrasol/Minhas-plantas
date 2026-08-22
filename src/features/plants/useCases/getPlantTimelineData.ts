import { buildTimeline } from "@/domain/timeline/buildTimeline";
import { applicationsRepository } from "@/services/firebase/firestore/applicationsRepository";
import { photosRepository } from "@/services/firebase/firestore/photosRepository";
import { productsRepository } from "@/services/firebase/firestore/productsRepository";
import type { TimelineEntry } from "@/types/view-models";

export async function getPlantTimelineData(
  userId: string,
  plantId: string
): Promise<TimelineEntry[]> {
  const [photos, applications, products] = await Promise.all([
    photosRepository.listByPlantId(userId, plantId),
    applicationsRepository.listByPlantId(userId, plantId),
    productsRepository.list(userId),
  ]);

  const productsById = new Map(products.map((p) => [p.id, p]));
  const applicationsWithProduct = applications.map((application) => ({
    ...application,
    product: productsById.get(application.productId),
  }));

  return buildTimeline(photos, applicationsWithProduct);
}
