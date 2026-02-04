import express, { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import { authMiddleware } from './auth-middleware';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directory
const uploadDir = path.join(__dirname, 'uploads', 'products');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * POST /api/upload/image
 * Upload a product image locally
 * Returns: { url: string, key: string }
 */
router.post('/image', authMiddleware, async (req: any, res: Response) => {
  try {
    // Check if file is provided
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file: UploadedFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
    
    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save file to disk
    await file.mv(filePath);

    // Generate accessible URL (relative path for serving)
    const fileUrl = `/uploads/products/${uniqueFileName}`;

    res.json({
      success: true,
      url: fileUrl,
      key: uniqueFileName,
    });
  } catch (error) {
    console.error('[Upload] Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
