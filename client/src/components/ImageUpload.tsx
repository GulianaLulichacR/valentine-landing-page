import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

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

  const handleUploadSuccess = (result: any) => {
    try {
      const imageUrl = result.info.secure_url;
      const publicId = result.info.public_id;

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
    }
  };

  const handleUploadError = (error: any) => {
    const errorMessage = error?.message || 'Error al subir la imagen';
    setError(errorMessage);
    console.error('[ImageUpload] Upload error:', error);
  };

  return (
    <div className="w-full space-y-4">
      {/* Cloudinary Upload Widget */}
      <CldUploadWidget
        uploadPreset={uploadPreset}
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        onOpen={() => setIsLoading(true)}
        onClose={() => setIsLoading(false)}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={isLoading}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 w-full ${
              isLoading
                ? 'border-primary bg-primary/5 opacity-50 cursor-not-allowed'
                : 'border-border bg-muted/30 hover:border-primary/50 cursor-pointer'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
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
          </button>
        )}
      </CldUploadWidget>

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
