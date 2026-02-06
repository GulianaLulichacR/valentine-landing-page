import { describe, it, expect } from 'vitest';

describe('Cloudinary Configuration', () => {
  it('should have required environment variables set', () => {
    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    expect(cloudName).toBeDefined();
    expect(cloudName).not.toBe('');
    expect(uploadPreset).toBeDefined();
    expect(uploadPreset).not.toBe('');
  });

  it('should validate Cloudinary cloud name format', () => {
    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    // Cloud name should be alphanumeric and lowercase
    expect(cloudName).toMatch(/^[a-z0-9]+$/);
  });

  it('should validate Cloudinary upload preset format', () => {
    const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    // Upload preset should contain only alphanumeric, hyphens, and underscores
    expect(uploadPreset).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
});
