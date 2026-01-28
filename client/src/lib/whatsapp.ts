import { CheckoutFormData } from '@/components/CheckoutModal';

/**
 * Generar mensaje de WhatsApp con los datos del pedido
 */
export function generateWhatsAppMessage(
  productName: string,
  productPrice: string,
  formData: CheckoutFormData
): string {
  const message = `Hola! 💝

Quiero realizar un pedido de San Valentín:

*Producto:* ${productName}
*Precio:* ${productPrice}

*De:* ${formData.senderName}
*Para:* ${formData.recipientName}
*Fecha de Entrega:* ${new Date(formData.deliveryDate).toLocaleDateString('es-PE')}

${formData.message ? `*Dedicatoria:* ${formData.message}` : ''}

¿Cómo realizo el pago? ¿Cuál es el proceso de entrega?`;

  return message;
}

/**
 * Generar URL de WhatsApp
 * Nota: Reemplaza el número con el número de WhatsApp de tu negocio
 */
export function generateWhatsAppLink(message: string, phoneNumber: string = '51987654321'): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Abrir WhatsApp con el mensaje
 */
export function openWhatsApp(
  productName: string,
  productPrice: string,
  formData: CheckoutFormData,
  phoneNumber: string = '51987654321'
): void {
  const message = generateWhatsAppMessage(productName, productPrice, formData);
  const link = generateWhatsAppLink(message, phoneNumber);
  window.open(link, '_blank');
}
