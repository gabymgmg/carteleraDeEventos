import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Usamos memoria para evitar la librería multer-storage-cloudinary que está rota
const storage = multer.memoryStorage();
const uploadCloud = multer({ storage });

export default uploadCloud;
