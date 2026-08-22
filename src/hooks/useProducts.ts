import { listProducts } from "@/features/products/useCases/productUseCases";
import { useAsyncData } from "./useAsyncData";
import { useAuth } from "./useAuth";

export function useProducts() {
  const { user } = useAuth();
  return useAsyncData(
    user ? () => listProducts(user.uid) : null,
    [user?.uid]
  );
}
