import { v2 as cloudinary } from 'cloudinary';

export const REVIEW_IMAGE_FOLDER = process.env.CLOUDINARY_REVIEW_FOLDER || 'sistema-mapas/resenas';
export const REVIEW_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || '';

const getRequiredConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary no esta configurado');
  }

  return { cloudName, apiKey, apiSecret };
};

export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

export const configureCloudinary = () => {
  const { cloudName, apiKey, apiSecret } = getRequiredConfig();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return { cloudName, apiKey, apiSecret };
};

export const createReviewUploadSignature = () => {
  const { cloudName, apiKey, apiSecret } = configureCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    folder: REVIEW_IMAGE_FOLDER,
    timestamp,
  };

  if (REVIEW_UPLOAD_PRESET) {
    paramsToSign.upload_preset = REVIEW_UPLOAD_PRESET;
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    cloudName,
    apiKey,
    timestamp,
    folder: REVIEW_IMAGE_FOLDER,
    uploadPreset: REVIEW_UPLOAD_PRESET || null,
    signature,
  };
};

export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured()) return null;

  configureCloudinary();
  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  });
};
