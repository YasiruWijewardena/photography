// lib/multer.js

import multer from 'multer';
import path from 'path';

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the directory to store uploaded files
    cb(null, 'public/uploads/photos');
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and GIF files are allowed'), false);
  }
};

// Initialize Multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
});

export default upload;
