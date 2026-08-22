import { collection, getDocs, query, where } from "firebase/firestore";
import type { Recommendation } from "@/types/entities";
import { db } from "../client";
import { makeConverter } from "../converters";

const converter = makeConverter<Recommendation>();
const colRef = () => collection(db, "recommendations").withConverter(converter);

async function listByProductType(
  productType: Recommendation["productType"]
): Promise<Recommendation[]> {
  const snapshot = await getDocs(
    query(colRef(), where("productType", "==", productType))
  );
  return snapshot.docs.map((d) => d.data());
}

async function listAll(): Promise<Recommendation[]> {
  const snapshot = await getDocs(colRef());
  return snapshot.docs.map((d) => d.data());
}

export const recommendationsRepository = { listByProductType, listAll };
