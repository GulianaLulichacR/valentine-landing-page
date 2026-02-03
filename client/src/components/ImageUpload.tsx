import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string, key: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Solo se permiten archivos JPEG, PNG, WebP y GIF');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('El archivo no puede exceder 5MB');
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      onImageUpload(data.url, data.key);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('[ImageUpload] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-border bg-muted/30 hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          id="image-input"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileInput}
          disabled={isLoading}
          className="hidden"
        />

        <label
          htmlFor="image-input"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <Upload
            size={32}
            className={`transition-colors ${
              isDragging ? 'text-primary' : 'text-foreground/50'
            }`}
          />
          <div>
            <p className="font-semibold text-foreground">
              {isLoading ? 'Subiendo imagen...' : 'Arrastra la imagen aquí'}
            </p>
            <p className="text-sm text-foreground/60">
              o haz clic para seleccionar (máx. 5MB)
            </p>
          </div>
        </label>
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={18} />
          Imagen subida exitosamente
        </div>
      )}
    </div>
  );
}
