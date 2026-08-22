import imageCompression from "browser-image-compression";

/**
 * Photos are stored as base64 data URIs directly in Firestore (no
 * Storage/Blaze plan needed), so the compressed binary must leave
 * comfortable room under Firestore's 1 MiB per-document limit once
 * base64-encoded (~1.33x inflation). 0.5MB binary -> ~0.66MB encoded.
 */
export async function compressPlantPhoto(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: "image/webp",
  });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
