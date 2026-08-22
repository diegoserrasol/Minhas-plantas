import { productsRepository } from "@/services/firebase/firestore/productsRepository";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function useProduct(productId: string) {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => productsRepository.getById(user.uid, productId) : null,
    [user?.uid, productId]
  );
}
