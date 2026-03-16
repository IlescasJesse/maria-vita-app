import {
  MAX_AVATAR_DIMENSION,
  MAX_AVATAR_UPLOAD_BYTES,
  MAX_STORED_AVATAR_BYTES,
  TARGET_AVATAR_MAX_BYTES,
  estimateDataUrlBytes,
  extractMimeTypeFromDataUrl,
  normalizeAvatarMimeType,
} from './avatarPhoto';

export interface OptimizedAvatarResult {
  dataUrl: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  originalSizeBytes: number;
}

const TARGET_DIMENSIONS = [512, 384, 320, 256, 192, 160, 128];
const QUALITY_STEPS = [0.86, 0.8, 0.74, 0.68, 0.62];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    reader.readAsDataURL(file);
  });
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo procesar la imagen seleccionada.'));
    };

    image.src = objectUrl;
  });
}

function canvasSupportsMimeType(mimeType: string): boolean {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL(mimeType).startsWith(`data:${mimeType}`);
}

export async function optimizeAvatarFile(file: File): Promise<OptimizedAvatarResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecciona un archivo de imagen válido.');
  }

  if (file.size > MAX_AVATAR_UPLOAD_BYTES) {
    throw new Error('La imagen supera el límite de 8 MB.');
  }

  const normalizedMimeType = normalizeAvatarMimeType(file.type);

  if (normalizedMimeType === 'image/svg+xml') {
    const dataUrl = await readFileAsDataUrl(file);
    const sizeBytes = estimateDataUrlBytes(dataUrl);

    if (sizeBytes > MAX_STORED_AVATAR_BYTES) {
      throw new Error('El SVG es demasiado grande para usarlo como avatar.');
    }

    return {
      dataUrl,
      mimeType: 'image/svg+xml',
      sizeBytes,
      width: MAX_AVATAR_DIMENSION,
      height: MAX_AVATAR_DIMENSION,
      originalSizeBytes: file.size,
    };
  }

  const image = await loadImageFromFile(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const cropSize = Math.min(sourceWidth, sourceHeight);
  const cropX = Math.max(0, Math.floor((sourceWidth - cropSize) / 2));
  const cropY = Math.max(0, Math.floor((sourceHeight - cropSize) / 2));

  const preferredMimeTypes = ['image/webp', 'image/jpeg', 'image/png'].filter(canvasSupportsMimeType);
  if (preferredMimeTypes.length === 0) {
    preferredMimeTypes.push('image/jpeg');
  }

  const usableDimensions = Array.from(new Set(
    TARGET_DIMENSIONS.filter((dimension) => dimension <= Math.max(128, cropSize))
  )).sort((a, b) => b - a);

  let bestCandidate: OptimizedAvatarResult | null = null;

  for (const dimension of usableDimensions) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(dimension, MAX_AVATAR_DIMENSION);
    canvas.height = Math.min(dimension, MAX_AVATAR_DIMENSION);

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No fue posible preparar la imagen para el avatar.');
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      image,
      cropX,
      cropY,
      cropSize,
      cropSize,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    for (const mimeType of preferredMimeTypes) {
      const qualities = mimeType === 'image/png' ? [undefined] : QUALITY_STEPS;

      for (const quality of qualities) {
        const dataUrl = quality === undefined
          ? canvas.toDataURL(mimeType)
          : canvas.toDataURL(mimeType, quality);
        const outputMimeType = extractMimeTypeFromDataUrl(dataUrl) || mimeType;
        const sizeBytes = estimateDataUrlBytes(dataUrl);

        const candidate: OptimizedAvatarResult = {
          dataUrl,
          mimeType: outputMimeType,
          sizeBytes,
          width: canvas.width,
          height: canvas.height,
          originalSizeBytes: file.size,
        };

        if (!bestCandidate || candidate.sizeBytes < bestCandidate.sizeBytes) {
          bestCandidate = candidate;
        }

        if (candidate.sizeBytes <= TARGET_AVATAR_MAX_BYTES) {
          return candidate;
        }
      }
    }
  }

  if (bestCandidate && bestCandidate.sizeBytes <= MAX_STORED_AVATAR_BYTES) {
    return bestCandidate;
  }

  throw new Error('No fue posible optimizar la imagen lo suficiente para usarla como avatar.');
}
