import express, { Router, Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import { authMiddleware } from './auth-middleware';

const router = Router();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'valentine-products';

/**
 * POST /api/upload/image
 * Upload a product image to S3
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
    const uniqueFileName = `products/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await s3Client.send(uploadCommand);

    // Generate S3 URL
    const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/${uniqueFileName}`;

    res.json({
      success: true,
      url: s3Url,
      key: uniqueFileName,
    });
  } catch (error) {
    console.error('[Upload] Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
