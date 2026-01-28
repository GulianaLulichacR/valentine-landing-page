import { useState } from 'react';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: string;
  onSubmit: (data: CheckoutFormData) => void;
}

export interface CheckoutFormData {
  senderName: string;
  recipientName: string;
  message: string;
  deliveryDate: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  productName,
  productPrice,
  onSubmit,
}: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    senderName: '',
    recipientName: '',
    message: '',
    deliveryDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.senderName.trim() || !formData.recipientName.trim() || !formData.deliveryDate) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(formData);
      setFormData({
        senderName: '',
        recipientName: '',
        message: '',
        deliveryDate: '',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-pink-600 px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Completa tu Pedido</h2>
            <p className="text-red-100 text-sm mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Precio */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Precio del Producto</p>
            <p className="text-3xl font-bold text-red-600">{productPrice}</p>
          </div>

          {/* Nombre de quien envía */}
          <div>
            <label htmlFor="senderName" className="block text-sm font-semibold text-gray-700 mb-2">
              Tu Nombre *
            </label>
            <input
              type="text"
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Ej: Juan García"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Nombre de quien recibe */}
          <div>
            <label htmlFor="recipientName" className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de quien lo recibe *
            </label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Ej: María López"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Dedicatoria */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              Dedicatoria (Opcional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe un mensaje especial..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>

          {/* Fecha de entrega */}
          <div>
            <label htmlFor="deliveryDate" className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de Entrega *
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Procesando...' : 'Enviar por WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
