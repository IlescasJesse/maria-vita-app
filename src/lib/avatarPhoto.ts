const ROOT_RELATIVE_URL_PATTERN = /^\/(?!\/).+/;
const IMAGE_DATA_URL_PATTERN = /^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=\s]+)$/i;

export const SUPPORTED_AVATAR_INPUT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/svg+xml',
  'image/avif',
  'image/heic',
  'image/heif',
] as const;

export const SUPPORTED_AVATAR_OUTPUT_MIME_TYPES = [
  'image/webp',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
] as const;

export const AVATAR_UPLOAD_ACCEPT = SUPPORTED_AVATAR_INPUT_MIME_TYPES.join(',');
export const MAX_AVATAR_UPLOAD_BYTES = 8 * 1024 * 1024;
export const TARGET_AVATAR_MAX_BYTES = 220 * 1024;
export const MAX_STORED_AVATAR_BYTES = 450 * 1024;
export const MAX_AVATAR_DIMENSION = 512;

export function normalizeAvatarMimeType(mimeType?: string | null): string {
  const normalized = String(mimeType || '').trim().toLowerCase();

  if (normalized === 'image/jpg') {
    return 'image/jpeg';
  }

  return normalized;
}

export function isSupportedAvatarInputMimeType(mimeType?: string | null): boolean {
  const normalized = normalizeAvatarMimeType(mimeType);
  return SUPPORTED_AVATAR_INPUT_MIME_TYPES.includes(normalized as typeof SUPPORTED_AVATAR_INPUT_MIME_TYPES[number]);
}

export function isSupportedAvatarOutputMimeType(mimeType?: string | null): boolean {
  const normalized = normalizeAvatarMimeType(mimeType);
  return SUPPORTED_AVATAR_OUTPUT_MIME_TYPES.includes(normalized as typeof SUPPORTED_AVATAR_OUTPUT_MIME_TYPES[number]);
}

export function extractMimeTypeFromDataUrl(value?: string | null): string | null {
  const match = String(value || '').match(IMAGE_DATA_URL_PATTERN);
  if (!match) {
    return null;
  }

  return normalizeAvatarMimeType(match[1]);
}

export function estimateDataUrlBytes(value?: string | null): number {
  const match = String(value || '').match(IMAGE_DATA_URL_PATTERN);
  if (!match) {
    return 0;
  }

  const base64Payload = String(match[2] || '').replace(/\s+/g, '');
  const padding = (base64Payload.match(/=*$/)?.[0].length ?? 0);
  return Math.max(0, Math.floor((base64Payload.length * 3) / 4) - padding);
}

export function isValidAvatarPhotoValue(value?: string | null): boolean {
  const normalized = String(value || '').trim();

  if (!normalized) {
    return false;
  }

  if (ROOT_RELATIVE_URL_PATTERN.test(normalized)) {
    return true;
  }

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    try {
      const parsed = new URL(normalized);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  const mimeType = extractMimeTypeFromDataUrl(normalized);
  return Boolean(mimeType && isSupportedAvatarOutputMimeType(mimeType));
}

export function getAvatarFileExtension(mimeType?: string | null): string {
  switch (normalizeAvatarMimeType(mimeType)) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/svg+xml':
      return 'svg';
    default:
      return 'bin';
  }
}
