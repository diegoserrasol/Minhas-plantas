import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  type CollectionReference,
  type UpdateData,
} from "firebase/firestore";
import { db } from "../client";
import { makeConverter } from "../converters";

/**
 * Shared CRUD surface for entities stored at `users/{uid}/{collectionName}`.
 * Every feature repository builds on this instead of re-implementing
 * create/read/update/delete against Firestore.
 */
export function createUserSubcollectionRepository<
  T extends { id: string; userId: string },
>(collectionName: string) {
  const converter = makeConverter<T>();

  function colRef(uid: string): CollectionReference<T> {
    return collection(db, "users", uid, collectionName).withConverter(
      converter
    );
  }

  async function create(uid: string, data: Omit<T, "id">): Promise<T> {
    const ref = doc(colRef(uid));
    const entity = { ...data, id: ref.id } as T;
    await setDoc(ref, entity);
    return entity;
  }

  async function getById(uid: string, id: string): Promise<T | null> {
    const snapshot = await getDoc(doc(colRef(uid), id));
    return snapshot.exists() ? snapshot.data() : null;
  }

  async function list(uid: string): Promise<T[]> {
    const snapshot = await getDocs(colRef(uid));
    return snapshot.docs.map((d) => d.data());
  }

  async function update(
    uid: string,
    id: string,
    data: Partial<Omit<T, "id" | "userId">>
  ): Promise<void> {
    await updateDoc(doc(colRef(uid), id), data as UpdateData<T>);
  }

  async function remove(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(colRef(uid), id));
  }

  return { colRef, create, getById, list, update, remove };
}
