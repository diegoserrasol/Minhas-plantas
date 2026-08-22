import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { afterAll, afterEach, beforeAll, describe, it } from "vitest";

const PROJECT_ID = "minhas-plantas-rules-test";
const OWNER_UID = "user-a";
const OTHER_UID = "user-b";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

function plantPath(uid: string, plantId: string) {
  return `users/${uid}/plants/${plantId}`;
}

async function seedPlant(uid: string, plantId: string) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), plantPath(uid, plantId)), {
      id: plantId,
      userId: uid,
      name: "Monstera",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}

describe("Firestore Security Rules — isolamento entre usuários", () => {
  it("usuário A não consegue ler plantas de B", async () => {
    await seedPlant(OTHER_UID, "plant-1");
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertFails(getDoc(doc(asA, plantPath(OTHER_UID, "plant-1"))));
  });

  it("usuário A consegue ler suas próprias plantas", async () => {
    await seedPlant(OWNER_UID, "plant-1");
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertSucceeds(getDoc(doc(asA, plantPath(OWNER_UID, "plant-1"))));
  });

  it("usuário A não consegue atualizar plantas de B", async () => {
    await seedPlant(OTHER_UID, "plant-1");
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertFails(
      updateDoc(doc(asA, plantPath(OTHER_UID, "plant-1")), { name: "Hackeada" })
    );
  });

  it("usuário A não consegue excluir plantas de B", async () => {
    await seedPlant(OTHER_UID, "plant-1");
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertFails(deleteDoc(doc(asA, plantPath(OTHER_UID, "plant-1"))));
  });

  it("usuário não autenticado não consegue ler nem escrever", async () => {
    await seedPlant(OWNER_UID, "plant-1");
    const anon = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anon, plantPath(OWNER_UID, "plant-1"))));
    await assertFails(
      setDoc(doc(anon, plantPath(OWNER_UID, "plant-2")), {
        id: "plant-2",
        userId: OWNER_UID,
        name: "Invasora",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("criação com userId forjado (diferente do uid autenticado) é negada", async () => {
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertFails(
      setDoc(doc(asA, plantPath(OWNER_UID, "plant-3")), {
        id: "plant-3",
        userId: OTHER_UID,
        name: "Planta forjada",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("criação de planta sem nome é negada", async () => {
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertFails(
      setDoc(doc(asA, plantPath(OWNER_UID, "plant-4")), {
        id: "plant-4",
        userId: OWNER_UID,
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("criação de produto com type inválido é negada", async () => {
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertFails(
      setDoc(doc(asA, `users/${OWNER_UID}/products/prod-1`), {
        id: "prod-1",
        userId: OWNER_UID,
        name: "Produto X",
        type: "invalido",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("criação de produto com type válido é aceita", async () => {
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertSucceeds(
      setDoc(doc(asA, `users/${OWNER_UID}/products/prod-2`), {
        id: "prod-2",
        userId: OWNER_UID,
        name: "NPK 10-10-10",
        type: "mineral",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("criação de ciclo sem planta nem grupo é negada", async () => {
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertFails(
      setDoc(doc(asA, `users/${OWNER_UID}/careCycles/cycle-1`), {
        id: "cycle-1",
        userId: OWNER_UID,
        productId: "prod-1",
        frequencyValue: 15,
        frequencyUnit: "dias",
        startDate: new Date(),
        status: "ativo",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("criação de ciclo com planta E grupo simultaneamente é negada", async () => {
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertFails(
      setDoc(doc(asA, `users/${OWNER_UID}/careCycles/cycle-2`), {
        id: "cycle-2",
        userId: OWNER_UID,
        plantId: "plant-1",
        groupId: "group-1",
        productId: "prod-1",
        frequencyValue: 15,
        frequencyUnit: "dias",
        startDate: new Date(),
        status: "ativo",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("criação de ciclo válido (somente planta) é aceita", async () => {
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertSucceeds(
      setDoc(doc(asA, `users/${OWNER_UID}/careCycles/cycle-3`), {
        id: "cycle-3",
        userId: OWNER_UID,
        plantId: "plant-1",
        productId: "prod-1",
        frequencyValue: 15,
        frequencyUnit: "dias",
        startDate: new Date(),
        status: "ativo",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("aplicação já criada não pode ser atualizada (imutável)", async () => {
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), `users/${OWNER_UID}/applications/app-1`), {
        id: "app-1",
        userId: OWNER_UID,
        plantId: "plant-1",
        productId: "prod-1",
        date: new Date(),
        createdAt: new Date(),
      });
    });
    await assertFails(
      updateDoc(doc(asA, `users/${OWNER_UID}/applications/app-1`), {
        dose: 999,
      })
    );
  });

  it("recomendações são legíveis por qualquer usuário autenticado, mas não graváveis pelo cliente", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "recommendations/rec-1"), {
        id: "rec-1",
        speciesOrCategory: "Monstera",
      });
    });
    const asA = testEnv.authenticatedContext(OWNER_UID).firestore();
    await assertSucceeds(getDoc(doc(asA, "recommendations/rec-1")));
    await assertFails(
      setDoc(doc(asA, "recommendations/rec-2"), { id: "rec-2" })
    );
  });
});
