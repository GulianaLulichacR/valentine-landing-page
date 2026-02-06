import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string, key: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        Error: Cloudinary no está configurado correctamente. Verifica las variables de entorno.
      </div>
    );
  }

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('cloud_name', cloudName);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen a Cloudinary');
      }

      const result = await response.json();
      const imageUrl = result.secure_url;
      const publicId = result.public_id;

      setPreview(imageUrl);
      onImageUpload(imageUrl, publicId);
      setSuccess(true);
      setError(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la imagen';
      setError(errorMessage);
      console.error('[ImageUpload] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [cloudName, uploadPreset, onImageUpload]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Manual Upload Input */}
      <label
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 w-full block cursor-pointer ${
          isLoading
            ? 'border-primary bg-primary/5 opacity-50 cursor-not-allowed'
            : 'border-border bg-muted/30 hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={isLoading}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          {isLoading ? (
            <Loader2 size={32} className="text-primary animate-spin" />
          ) : (
            <Upload size={32} className="text-foreground/50" />
          )}
          <div>
            <p className="font-semibold text-foreground">
              {isLoading ? 'Subiendo imagen...' : 'Haz clic para seleccionar imagen'}
            </p>
            <p className="text-sm text-foreground/60">
              o arrastra la imagen aquí (máx. 5MB)
            </p>
          </div>
        </div>
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setSuccess(false);
            }}
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
          Imagen subida exitosamente a Cloudinary
        </div>
      )}

      {/* Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
        <p className="font-semibold mb-1">Ventajas de Cloudinary:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Redimensionamiento automático de imágenes</li>
          <li>Optimización para web (menor tamaño)</li>
          <li>CDN global para carga rápida</li>
          <li>Plan gratuito generoso</li>
        </ul>
      </div>
    </div>
  );
}
