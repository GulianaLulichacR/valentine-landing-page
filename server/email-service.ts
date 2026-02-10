import nodemailer from 'nodemailer';
import { Order } from '../drizzle/schema';

// Configurar transporte de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'gulianalulichacr048@gmail.com',
    pass: process.env.GMAIL_PASSWORD || '',
  },
});

/**
 * Enviar notificación de nuevo pedido al admin
 */
export async function sendOrderNotificationEmail(order: Order, adminEmail: string) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .order-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 Nuevo Pedido Recibido</h1>
            </div>
            <div class="content">
              <p>¡Hola! Has recibido un nuevo pedido en Regala Amor.</p>
              
              <div class="order-details">
                <h2 style="color: #dc2626; margin-top: 0;">Detalles del Pedido</h2>
                
                <div class="detail-row">
                  <span class="label">ID del Pedido:</span>
                  <span class="value">#${order.id}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Producto:</span>
                  <span class="value">${order.productName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Precio:</span>
                  <span class="value">S/. ${order.productPrice}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Remitente:</span>
                  <span class="value">${order.senderName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Email del Remitente:</span>
                  <span class="value">${order.senderEmail || 'No proporcionado'}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Teléfono del Remitente:</span>
                  <span class="value">${order.senderPhone || 'No proporcionado'}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Destinatario:</span>
                  <span class="value">${order.recipientName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Fecha de Entrega Solicitada:</span>
                  <span class="value">${order.deliveryDate}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Mensaje:</span>
                  <span class="value">${order.message || 'Sin mensaje'}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Estado del Pedido:</span>
                  <span class="value" style="color: #dc2626; font-weight: bold;">${order.orderStatus}</span>
                </div>
              </div>
              
              <p style="margin-top: 20px; text-align: center;">
                <a href="${process.env.VITE_FRONTEND_URL || 'https://regala-amor.com'}/admin/orders" class="button">
                  Ver Pedido en Admin
                </a>
              </p>
            </div>
            
            <div class="footer">
              <p>Este es un email automático de Regala Amor. Por favor no responda a este email.</p>
              <p>&copy; 2026 Regala Amor. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'gulianalulichacr048@gmail.com',
      to: adminEmail,
      subject: `🎁 Nuevo Pedido #${order.id} - ${order.productName}`,
      html: htmlContent,
    });

    console.log(`Email de notificación enviado a ${adminEmail}`);
    return true;
  } catch (error) {
    console.error('Error al enviar email de notificación:', error);
    return false;
  }
}

/**
 * Enviar confirmación de pedido al cliente
 */
export async function sendOrderConfirmationEmail(order: Order, customerEmail: string) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .order-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💝 ¡Tu Pedido Ha Sido Recibido!</h1>
            </div>
            <div class="content">
              <p>¡Hola ${order.senderName}!</p>
              <p>Gracias por tu pedido en Regala Amor. Hemos recibido tu solicitud y pronto nos pondremos en contacto contigo.</p>
              
              <div class="order-details">
                <h2 style="color: #dc2626; margin-top: 0;">Resumen de tu Pedido</h2>
                
                <div class="detail-row">
                  <span class="label">Número de Pedido:</span>
                  <span class="value">#${order.id}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Producto:</span>
                  <span class="value">${order.productName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Precio:</span>
                  <span class="value">S/. ${order.productPrice}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Destinatario:</span>
                  <span class="value">${order.recipientName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Fecha de Entrega Solicitada:</span>
                  <span class="value">${order.deliveryDate}</span>
                </div>
              </div>
              
              <p style="margin-top: 20px; background-color: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
                <strong>📌 Próximos Pasos:</strong><br>
                Nos pondremos en contacto contigo pronto para confirmar los detalles de tu pedido y el método de pago.
              </p>
            </div>
            
            <div class="footer">
              <p>Este es un email automático de Regala Amor. Por favor no responda a este email.</p>
              <p>&copy; 2026 Regala Amor. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'gulianalulichacr048@gmail.com',
      to: customerEmail,
      subject: `Confirmación de Pedido #${order.id} - Regala Amor`,
      html: htmlContent,
    });

    console.log(`Email de confirmación enviado a ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error);
    return false;
  }
}
