/**
 * Photos live inline in Firestore as base64 data URIs (no Storage bucket,
 * no Blaze plan). A Firestore document is capped at 1 MiB and the security
 * rules reject any `url` longer than 900_000 chars, so compression has to
 * *guarantee* the result lands under budget — a library "target size" is
 * best-effort, and every overshoot became a permission-denied write.
 *
 * Everything here runs on a plain <canvas> on the main thread: it decodes
 * whatever the browser can already display (iPhone HEIC included, which the
 * old web-worker pipeline choked on) and always re-encodes to JPEG, so the
 * output format never depends on browser WebP support either.
 */

/** Hard ceiling for a stored data URI, comfortably under the rules' 900_000. */
export const MAX_PHOTO_DATA_URL_CHARS = 700_000;

/** Longest side, in px, tried first. Each retry step halves the detail budget. */
const DIMENSION_STEPS = [1280, 1024, 800, 640, 480];
const QUALITY_STEPS = [0.72, 0.6, 0.5, 0.4, 0.3];

export class ImageTooLargeError extends Error {
  constructor() {
    super(
      "Não foi possível reduzir esta imagem o suficiente. Tente uma foto menor."
    );
    this.name = "ImageTooLargeError";
  }
}

export class ImageUnreadableError extends Error {
  constructor() {
    super("Não foi possível ler esta imagem. Tente outra foto.");
    this.name = "ImageUnreadableError";
  }
}

/**
 * Reads an image File and returns a JPEG data URI guaranteed to fit
 * `maxChars`. Shrinks dimensions and quality progressively until it fits;
 * throws `ImageTooLargeError` only if even the smallest variant is too big.
 */
export async function compressImageToDataUrl(
  file: File,
  maxChars: number = MAX_PHOTO_DATA_URL_CHARS
): Promise<string> {
  const rawDataUrl = await readFileAsDataUrl(file);

  // Vector images have no canvas-friendly downscale — keep them verbatim
  // when they already fit, reject them when they don't.
  if (file.type === "image/svg+xml") {
    if (rawDataUrl.length <= maxChars) return rawDataUrl;
    throw new ImageTooLargeError();
  }

  const image = await loadImage(rawDataUrl);

  for (const maxDim of DIMENSION_STEPS) {
    const canvas = drawScaled(image, maxDim);
    if (!canvas) break;
    for (const quality of QUALITY_STEPS) {
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrl.length <= maxChars) return dataUrl;
    }
  }

  throw new ImageTooLargeError();
}

function drawScaled(
  image: HTMLImageElement,
  maxDim: number
): HTMLCanvasElement | null {
  const scale = Math.min(1, maxDim / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  // JPEG has no alpha: without this, transparent PNGs come out black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new ImageUnreadableError());
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeout = setTimeout(() => reject(new ImageUnreadableError()), 20000);
    img.onload = () => {
      clearTimeout(timeout);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new ImageUnreadableError());
    };
    img.src = src;
  });
}
