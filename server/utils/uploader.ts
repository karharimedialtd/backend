import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = file.fieldname === 'cover_art' ? 'covers' : 
                   file.fieldname === 'audio' ? 'audio' : 'files';
    const fullPath = path.join(uploadDir, subDir);
    
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'audio') {
    // Audio files
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/flac', 'audio/ogg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio file type. Allowed: MP3, WAV, MP4, FLAC, OGG'));
    }
  } else if (file.fieldname === 'cover_art') {
    // Image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Allowed: JPEG, PNG, WebP'));
    }
  } else {
    // General files
    cb(null, true);
  }
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 10
  }
});

// File upload configurations
export const uploadConfigs = {
  // Single audio file
  audio: upload.single('audio'),
  
  // Single cover art
  coverArt: upload.single('cover_art'),
  
  // Audio + cover art
  musicTrack: upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover_art', maxCount: 1 }
  ]),
  
  // Multiple files
  multiple: upload.array('files', 10),
  
  // Any files
  any: upload.any()
};

// Helper functions
export const getFileUrl = (filename: string, type: 'audio' | 'covers' | 'files' = 'files'): string => {
  return `/api/files/${type}/${filename}`;
};

export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export const validateFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};
