import { createReviewUploadSignature } from '../config/cloudinary.js';

export const getReviewUploadSignature = async (req, res) => {
  try {
    const data = createReviewUploadSignature();
    res.json({ success: true, data });
  } catch {
    res.status(500).json({
      success: false,
      message: 'No se pudo preparar la subida de imagenes',
    });
  }
};
