
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 1. Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configuración del Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'events_app',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      // Quitamos el public_id por ahora para que Cloudinary lo genere solo
      // y descartar errores ahí
    };
  },
});

// 3. Crear el middleware
// Agregamos una función de filtro para ver si Multer llega a este punto
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