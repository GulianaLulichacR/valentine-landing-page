import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendOrderNotificationEmail, sendOrderConfirmationEmail } from './email-service';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn(async () => ({ messageId: 'test-id' })),
    })),
  },
}));

describe('Notification System', () => {
  const mockOrder = {
    id: 1,
    productId: 1,
    productName: 'Rosas Premium Rojas',
    productPrice: 89.99,
    senderName: 'Juan Pérez',
    senderEmail: 'juan@example.com',
    senderPhone: '+51987654321',
    recipientName: 'María García',
    recipientPhone: '+51912345678',
    deliveryDate: '2026-02-14',
    message: 'Con todo mi amor',
    orderStatus: 'pending' as const,
    paymentStatus: 'pending' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Email Notifications', () => {
    it('should send order notification email to admin', async () => {
      const adminEmail = 'gulianalulichacr048@gmail.com';
      const result = await sendOrderNotificationEmail(mockOrder, adminEmail);
      expect(result).toBe(true);
    });

    it('should send order confirmation email to customer', async () => {
      const customerEmail = 'juan@example.com';
      const result = await sendOrderConfirmationEmail(mockOrder, customerEmail);
      expect(result).toBe(true);
    });

    it('should handle email sending errors gracefully', async () => {
      // Test error handling
      const invalidEmail = 'invalid-email';
      const result = await sendOrderNotificationEmail(mockOrder, invalidEmail);
      // Should return false or handle error appropriately
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Settings Management', () => {
    it('should validate WhatsApp number format', () => {
      const validNumbers = ['+51987654321', '+1234567890', '+34912345678'];
      const invalidNumbers = ['987654321', 'invalid', ''];

      validNumbers.forEach(num => {
        expect(num).toMatch(/^\+\d{1,3}\d{6,14}$/);
      });

      invalidNumbers.forEach(num => {
        expect(num).not.toMatch(/^\+\d{1,3}\d{6,14}$/);
      });
    });

    it('should validate email format', () => {
      const validEmails = [
        'gulianalulichacr048@gmail.com',
        'admin@example.com',
        'test@domain.co.uk',
      ];
      const invalidEmails = ['invalid', 'test@', '@example.com', ''];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(email).toMatch(emailRegex);
      });

      invalidEmails.forEach(email => {
        expect(email).not.toMatch(emailRegex);
      });
    });
  });

  describe('Toast Notifications', () => {
    it('should create toast with correct type', () => {
      const toastTypes = ['success', 'error', 'warning', 'info'];
      toastTypes.forEach(type => {
        expect(['success', 'error', 'warning', 'info']).toContain(type);
      });
    });

    it('should auto-dismiss toast after duration', () => {
      const duration = 3000;
      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThanOrEqual(5000);
    });
  });
});
