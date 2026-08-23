/**
 * Every mutation used to sit inside a bare `try { } finally { }`, so a
 * rejected Firestore write left the button idle and the user staring at an
 * unchanged screen. Forms now catch and run the error through here, which
 * turns Firebase's error codes into something actionable in Portuguese and
 * always logs the raw error for debugging.
 */

const FIREBASE_MESSAGES: Record<string, string> = {
  "permission-denied":
    "Permissão negada pelo Firestore. Verifique se as regras foram publicadas (firebase deploy --only firestore:rules).",
  unauthenticated: "Sua sessão expirou. Entre novamente para continuar.",
  "failed-precondition":
    "O Firestore precisa de um índice que ainda não existe. Rode: firebase deploy --only firestore:indexes.",
  unavailable:
    "Sem conexão com o Firestore. Verifique a internet e tente de novo.",
  "deadline-exceeded": "A operação demorou demais. Tente novamente.",
  "resource-exhausted":
    "Limite do Firestore atingido. Tente novamente mais tarde.",
  "invalid-argument":
    "Dados inválidos para o Firestore (provavelmente a foto excede o tamanho máximo do documento).",
  "not-found": "Registro não encontrado. Ele pode ter sido excluído.",
  "already-exists": "Esse registro já existe.",
  cancelled: "Operação cancelada.",
};

function firebaseCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const code = (error as { code?: unknown }).code;
  if (typeof code !== "string") return undefined;
  // Firestore codes arrive bare ("permission-denied"); Auth codes are
  // namespaced ("auth/wrong-password").
  return code.includes("/") ? code.split("/")[1] : code;
}

/**
 * Turns any thrown value into a message safe to show in a toast.
 * `fallback` is used when the error carries nothing recognizable.
 */
export function describeError(error: unknown, fallback: string): string {
  console.error(error);

  const code = firebaseCode(error);
  if (code && FIREBASE_MESSAGES[code]) return FIREBASE_MESSAGES[code];

  if (error instanceof Error && error.message) {
    // Firestore's size error is a plain Error, not a FirebaseError.
    if (error.message.includes("longer than 1048487 bytes")) {
      return "A foto ficou grande demais para o Firestore. Tente outra imagem.";
    }
    return error.message;
  }

  return fallback;
}
