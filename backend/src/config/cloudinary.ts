
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'events_app',
      allowed_formats: ['jpg', 'png', 'jpeg']
    };
  },
});

const uploadCloud = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('--- MULTER FILTRANDO ARCHIVO ---');
    console.log('Nombre original del archivo:', file.originalname);
    console.log('Campo del formulario (fieldname):', file.fieldname);
    cb(null, true);
  }
});

export default uploadCloud;