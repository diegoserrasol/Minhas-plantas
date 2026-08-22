import {
  collection,
  deleteDoc,
  deleteField,
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
 * updateDoc bypasses the converter (toFirestore never runs), and rejects
 * `undefined` outright. Unlike on create, silently dropping the key here
 * would leave the field's old value in place forever — so `undefined`
 * means "clear this field" and becomes Firestore's deleteField() sentinel.
 */
function undefinedToDeleteField(
  data: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).map(([key, val]) => [
      key,
      val === undefined ? deleteField() : val,
    ])
  );
}

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

  async function create(
    uid: string,
    data: Omit<T, "id">,
    explicitId?: string
  ): Promise<T> {
    const ref = explicitId ? doc(colRef(uid), explicitId) : doc(colRef(uid));
    const entity = { ...data, id: ref.id } as T;
    await setDoc(ref, entity);
    return entity;
  }

  /** Reserves an id for a document that doesn't exist yet — e.g. so an
   * uploaded photo's storage path can share the id before the entity
   * itself is created. */
  function newId(uid: string): string {
    return doc(colRef(uid)).id;
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
    await updateDoc(
      doc(colRef(uid), id),
      undefinedToDeleteField(data as Record<string, unknown>) as UpdateData<T>
    );
  }

  async function remove(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(colRef(uid), id));
  }

  return { colRef, create, newId, getById, list, update, remove };
}
