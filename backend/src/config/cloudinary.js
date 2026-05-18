import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bookshop/pdfs',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  },
});

export const uploadPdf = multer({ storage: pdfStorage });
export default cloudinary;
