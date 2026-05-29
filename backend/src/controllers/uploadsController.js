import { createPlaceUploadSignature, createReviewUploadSignature } from '../config/cloudinary.js';

export const getReviewUploadSignature = async (req, res) => {
  try {
    const target = String(req.body?.target || req.body?.type || 'review').toLowerCase();
    const isPlaceUpload = ['place', 'lugar', 'lugares'].includes(target);
    const isReviewUpload = ['review', 'resena', 'resenas'].includes(target);

    if (!isPlaceUpload && !isReviewUpload) {
      return res.status(400).json({ success: false, message: 'Tipo de subida no soportado' });
    }

    const data = isPlaceUpload ? createPlaceUploadSignature() : createReviewUploadSignature();
    res.json({ success: true, data });
  } catch {
    res.status(500).json({
      success: false,
      message: 'No se pudo preparar la subida de imagenes',
    });
  }
};
