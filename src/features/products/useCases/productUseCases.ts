import { productsRepository } from "@/services/firebase/firestore/productsRepository";
import type { Product } from "@/types/entities";

export type CreateProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const now = new Date();
  return productsRepository.create(input.userId, {
    ...input,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateProduct(
  userId: string,
  productId: string,
  data: Partial<Omit<Product, "id" | "userId" | "createdAt">>
): Promise<void> {
  await productsRepository.update(userId, productId, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteProduct(
  userId: string,
  productId: string
): Promise<void> {
  await productsRepository.remove(userId, productId);
}

export async function listProducts(userId: string): Promise<Product[]> {
  return productsRepository.list(userId);
}
