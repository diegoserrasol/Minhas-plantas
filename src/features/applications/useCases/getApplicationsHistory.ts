import { applicationsRepository } from "@/services/firebase/firestore/applicationsRepository";
import { groupsRepository } from "@/services/firebase/firestore/groupsRepository";
import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import { productsRepository } from "@/services/firebase/firestore/productsRepository";
import type { Application, Group, Plant, Product } from "@/types/entities";

export interface EnrichedApplication extends Application {
  product?: Product;
  plant?: Plant;
  group?: Group;
}

export async function getApplicationsHistory(
  userId: string
): Promise<EnrichedApplication[]> {
  const [applications, products, plants, groups] = await Promise.all([
    applicationsRepository.listRecent(userId, 200),
    productsRepository.list(userId),
    plantsRepository.list(userId),
    groupsRepository.list(userId),
  ]);

  const productsById = new Map(products.map((p) => [p.id, p]));
  const plantsById = new Map(plants.map((p) => [p.id, p]));
  const groupsById = new Map(groups.map((g) => [g.id, g]));

  return applications.map((application) => ({
    ...application,
    product: productsById.get(application.productId),
    plant: application.plantId ? plantsById.get(application.plantId) : undefined,
    group: application.groupId ? groupsById.get(application.groupId) : undefined,
  }));
}
