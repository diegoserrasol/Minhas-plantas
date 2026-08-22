import type { Product } from "@/types/entities";
import { createUserSubcollectionRepository } from "./createUserSubcollectionRepository";

export const productsRepository =
  createUserSubcollectionRepository<Product>("products");
