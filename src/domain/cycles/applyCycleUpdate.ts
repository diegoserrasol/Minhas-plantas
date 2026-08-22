import type { CareCycle } from "@/types/entities";
import { calculateNextApplicationDate } from "./calculateNextApplicationDate";

/**
 * Pure transition: given a cycle and the date an application was just
 * registered against it, returns the updated cycle. Does not persist
 * anything — callers are responsible for writing the result.
 */
export function applyCycleUpdate(
  cycle: CareCycle,
  applicationDate: Date
): CareCycle {
  return {
    ...cycle,
    lastApplicationDate: applicationDate,
    nextApplicationDate: calculateNextApplicationDate(
      applicationDate,
      cycle.frequencyValue,
      cycle.frequencyUnit
    ),
    updatedAt: new Date(),
  };
}
