import { daysBetween, getCareUrgency } from "@/domain/care/careUrgency";
import { sortUpcomingCare } from "@/domain/care/sortUpcomingCare";
import { applicationsRepository } from "@/services/firebase/firestore/applicationsRepository";
import { cyclesRepository } from "@/services/firebase/firestore/cyclesRepository";
import { groupsRepository } from "@/services/firebase/firestore/groupsRepository";
import { plantsRepository } from "@/services/firebase/firestore/plantsRepository";
import { productsRepository } from "@/services/firebase/firestore/productsRepository";
import type { CareItem, DashboardData } from "@/types/view-models";

export async function getDashboardData(
  userId: string,
  today: Date
): Promise<DashboardData> {
  const [activeCycles, plants, groups, products, recentApplications] =
    await Promise.all([
      cyclesRepository.listActive(userId),
      plantsRepository.list(userId),
      groupsRepository.list(userId),
      productsRepository.list(userId),
      applicationsRepository.listRecent(userId, 8),
    ]);

  const plantsById = new Map(plants.map((p) => [p.id, p]));
  const groupsById = new Map(groups.map((g) => [g.id, g]));
  const productsById = new Map(products.map((p) => [p.id, p]));

  const careItems: CareItem[] = activeCycles
    .filter((cycle) => cycle.nextApplicationDate)
    .map((cycle) => {
      const product = productsById.get(cycle.productId);
      return {
        cycle,
        product: product!,
        plant: cycle.plantId ? plantsById.get(cycle.plantId) : undefined,
        group: cycle.groupId ? groupsById.get(cycle.groupId) : undefined,
        urgency: getCareUrgency(cycle.nextApplicationDate!, today),
        daysFromToday: daysBetween(today, cycle.nextApplicationDate!),
      };
    })
    .filter((item) => item.product);

  const overdue = sortUpcomingCare(
    careItems.filter((i) => i.urgency === "atrasado")
  );
  const todayItems = sortUpcomingCare(
    careItems.filter((i) => i.urgency === "hoje")
  );
  const upcoming = sortUpcomingCare(
    careItems.filter((i) => i.urgency === "proximo")
  );

  return {
    overdue,
    today: todayItems,
    upcoming,
    recentApplications: recentApplications.map((application) => ({
      ...application,
      product: productsById.get(application.productId),
      plant: application.plantId
        ? plantsById.get(application.plantId)
        : undefined,
    })),
    plantCount: plants.length,
  };
}
