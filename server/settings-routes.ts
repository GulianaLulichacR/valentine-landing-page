import { Router } from 'express';
import { getDb } from './db';
import { settings } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = Router();

/**
 * GET /api/admin/settings
 * Obtener configuración actual
 */
router.get('/api/admin/settings', async (req, res) => {
  try {
    const db = await getDb();
    const currentSettings = await db.query.settings.findFirst();
    
    if (!currentSettings) {
      // Crear configuración por defecto si no existe
      const defaultSettings = {
        whatsappNumber: '+51999999999',
        notificationEmail: 'gulianalulichacr048@gmail.com',
        siteName: 'Regala Amor',
        siteDescription: 'Arreglos florales exclusivos que expresan tus sentimientos',
      };
      
      await db.insert(settings).values(defaultSettings);
      return res.json(defaultSettings);
    }
    
    res.json(currentSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

/**
 * POST /api/admin/settings
 * Actualizar configuración
 */
router.post('/api/admin/settings', async (req, res) => {
  try {
    const db = await getDb();
    const { whatsappNumber, notificationEmail, siteName, siteDescription } = req.body;

    // Validar datos
    if (!whatsappNumber || !notificationEmail) {
      return res.status(400).json({ error: 'WhatsApp y email son requeridos' });
    }

    // Verificar que existe al menos una configuración
    const existingSettings = await db.query.settings.findFirst();
    
    if (!existingSettings) {
      // Crear nueva configuración
      await db.insert(settings).values({
        whatsappNumber,
        notificationEmail,
        siteName,
        siteDescription,
      });
    } else {
      // Actualizar configuración existente
      await db
        .update(settings)
        .set({
          whatsappNumber,
          notificationEmail,
          siteName,
          siteDescription,
        })
        .where(eq(settings.id, existingSettings.id));
    }

    res.json({ success: true, message: 'Configuración actualizada' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

export default router;
