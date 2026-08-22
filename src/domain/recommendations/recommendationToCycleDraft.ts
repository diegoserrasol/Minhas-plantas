import type { Recommendation } from "@/types/entities";

export interface CycleDraft {
  productType: Recommendation["productType"];
  dose: number;
  unit: Recommendation["unit"];
  method: Recommendation["method"];
  frequencyValue: number;
  frequencyUnit: Recommendation["frequencyUnit"];
  recommendationId: string;
}

/**
 * Suggested midpoint dose from a recommendation's range — a starting
 * point the user can still adjust, never applied without their review.
 */
export function recommendationToCycleDraft(
  recommendation: Recommendation
): CycleDraft {
  return {
    productType: recommendation.productType,
    dose: (recommendation.doseMin + recommendation.doseMax) / 2,
    unit: recommendation.unit,
    method: recommendation.method,
    frequencyValue: recommendation.frequencyValue,
    frequencyUnit: recommendation.frequencyUnit,
    recommendationId: recommendation.id,
  };
}
