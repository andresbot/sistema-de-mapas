import api from './api.js';

export const MAX_REVIEW_IMAGES = 3;
export const MAX_REVIEW_IMAGE_BYTES = 5 * 1024 * 1024;
export const REVIEW_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const toReviewImageMetadata = (result) => ({
  publicId: result.public_id,
  secureUrl: result.secure_url,
  width: result.width,
  height: result.height,
  format: result.format,
  bytes: result.bytes,
});

export const uploadReviewImages = async (files) => {
  if (!files?.length) return [];

  const signatureRes = await api.post('/uploads/signature');
  const signatureData = signatureRes.data?.data;

  if (!signatureData?.cloudName || !signatureData?.apiKey || !signatureData?.signature) {
    throw new Error('No se pudo preparar la subida de imagenes');
  }

  const uploads = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', String(signatureData.timestamp));
    formData.append('signature', signatureData.signature);
    formData.append('folder', signatureData.folder);

    if (signatureData.uploadPreset) {
      formData.append('upload_preset', signatureData.uploadPreset);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error?.message || 'No se pudo subir una imagen');
    }

    return toReviewImageMetadata(result);
  });

  return Promise.all(uploads);
};
