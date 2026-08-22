import { recommendationsRepository } from "@/services/firebase/firestore/recommendationsRepository";
import type { ProductType } from "@/types/entities";
import { useAsyncData } from "./useAsyncData";

export function useRecommendations(productType: ProductType | null) {
  return useAsyncData(
    productType
      ? () => recommendationsRepository.listByProductType(productType)
      : null,
    [productType]
  );
}
