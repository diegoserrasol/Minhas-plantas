import imageCompression from "browser-image-compression";

export async function compressPlantPhoto(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: "image/webp",
  });
}
