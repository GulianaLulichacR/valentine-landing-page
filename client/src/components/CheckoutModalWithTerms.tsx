import { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: string;
  onSubmit: (data: CheckoutFormData) => void;
}

export interface CheckoutFormData {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  recipientName: string;
  message: string;
  deliveryDate: string;
  termsAccepted: boolean;
  noRefundPolicy: boolean;
}

export default function CheckoutModalWithTerms({
  isOpen,
  onClose,
  productName,
  productPrice,
  onSubmit,
}: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'terms'>('form');
  const [formData, setFormData] = useState<CheckoutFormData>({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    recipientName: '',
    message: '',
    deliveryDate: '',
    termsAccepted: false,
    noRefundPolicy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (field: 'termsAccepted' | 'noRefundPolicy') => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.senderName.trim() || !formData.recipientName.trim() || !formData.deliveryDate) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar email
    if (formData.senderEmail && !formData.senderEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Ir a términos y condiciones
    setStep('terms');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que aceptó los términos
    if (!formData.termsAccepted || !formData.noRefundPolicy) {
      alert('Debes aceptar los términos y condiciones para continuar');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(formData);
      setFormData({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        recipientName: '',
        message: '',
        deliveryDate: '',
        termsAccepted: false,
        noRefundPolicy: false,
      });
      setStep('form');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-pink-600 px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {step === 'form' ? 'Completa tu Pedido' : 'Términos y Condiciones'}
            </h2>
            <p className="text-red-100 text-sm mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del Formulario */}
        {step === 'form' ? (
          <form onSubmit={handleContinue} className="p-6 space-y-4">
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

            {/* Email */}
            <div>
              <label htmlFor="senderEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                Tu Email (Opcional)
              </label>
              <input
                type="email"
                id="senderEmail"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="senderPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                Tu Teléfono (Opcional)
              </label>
              <input
                type="tel"
                id="senderPhone"
                name="senderPhone"
                value={formData.senderPhone}
                onChange={handleChange}
                placeholder="+51 987654321"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
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
              <p className="text-xs text-gray-500 mt-1">Mínimo 2 días a partir de hoy</p>
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
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Continuar
              </button>
            </div>
          </form>
        ) : (
          /* Términos y Condiciones */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Advertencia de tiempo de entrega */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Tiempo Mínimo de Entrega</h3>
                  <p className="text-sm text-yellow-800">
                    Este regalo requiere un tiempo mínimo de <strong>2 días hábiles</strong> para ser preparado y entregado. 
                    Por favor asegúrate de que la fecha de entrega que seleccionaste cumple con este requisito.
                  </p>
                </div>
              </div>
            </div>

            {/* Política de No Devolución */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Política de No Devolución</h3>
                  <p className="text-sm text-red-800">
                    Una vez que hayas realizado el pago y confirmado tu pedido, <strong>no se aceptarán devoluciones ni reembolsos</strong>. 
                    El dinero pagado es final y no reembolsable bajo ninguna circunstancia. 
                    Por favor verifica todos los detalles de tu pedido antes de confirmar.
                  </p>
                </div>
              </div>
            </div>

            {/* Términos Generales */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">Términos Generales</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>El pago debe realizarse antes de la preparación del regalo</li>
                <li>Los regalos se preparan de acuerdo a la disponibilidad de stock</li>
                <li>La entrega se realiza en la fecha acordada (sujeto a disponibilidad)</li>
                <li>Nos reservamos el derecho de cancelar pedidos con información incompleta</li>
                <li>Los datos personales serán tratados de forma confidencial</li>
              </ul>
            </div>

            {/* Checkboxes de Aceptación */}
            <div className="space-y-3 pt-4 border-t-2 border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={() => handleCheckboxChange('termsAccepted')}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  Acepto que el tiempo mínimo de entrega es de <strong>2 días hábiles</strong> y confirmo la fecha de entrega seleccionada.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.noRefundPolicy}
                  onChange={() => handleCheckboxChange('noRefundPolicy')}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  Entiendo y acepto que <strong>no hay devoluciones ni reembolsos</strong> una vez realizado el pago. 
                  El dinero pagado es final y no reembolsable.
                </span>
              </label>
            </div>

            {/* Indicador de aceptación */}
            {formData.termsAccepted && formData.noRefundPolicy && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded flex items-center gap-3">
                <CheckCircle2 className="text-green-600" size={20} />
                <p className="text-sm text-green-800">
                  ✓ Has aceptado todos los términos y condiciones
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={!formData.termsAccepted || !formData.noRefundPolicy || isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar y Enviar por WhatsApp'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
