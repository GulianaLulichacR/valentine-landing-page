import express, { Request, Response } from 'express';
import { getDb } from './db';
import { products, orders } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from './auth-routes';

const router = express.Router();

/**
 * GET /api/admin/stats - Obtener estadísticas del dashboard
 */
router.get('/stats', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    const allProducts = await db.select().from(products);
    const allOrders = await db.select().from(orders);

    const totalRevenue = allOrders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.productPrice);
    }, 0);

    const pendingOrders = allOrders.filter((o: any) => o.orderStatus === 'pending').length;

    res.json({
      totalProducts: allProducts.length,
      totalOrders: allOrders.length,
      totalRevenue,
      pendingOrders,
    });
  } catch (error) {
    console.error('[Admin] Error fetching stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

/**
 * GET /api/admin/products - Obtener todos los productos
 */
router.get('/products', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    console.error('[Admin] Error fetching products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

/**
 * POST /api/admin/products - Crear nuevo producto
 */
router.post('/products', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category, featured } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    const result = await db.insert(products).values({
      name,
      description,
      price: price.toString(),
      stock: stock || 0,
      category: category || 'San Valentin',
      featured: featured ? 1 : 0,
    });

    res.status(201).json({
      success: true,
      productId: result.insertId,
    });
  } catch (error) {
    console.error('[Admin] Error creating product:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

/**
 * PUT /api/admin/products/:id - Actualizar producto
 */
router.put('/products/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, featured } = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    await db
      .update(products)
      .set({
        name,
        description,
        price: price.toString(),
        stock,
        category,
        featured: featured ? 1 : 0,
        updatedAt: new Date(),
      })
      .where(eq(products.id, parseInt(id)));

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Error updating product:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

/**
 * DELETE /api/admin/products/:id - Eliminar producto
 */
router.delete('/products/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    // Soft delete o hard delete (aquí hacemos hard delete)
    // En producción, considera hacer soft delete
    await db.delete(products).where(eq(products.id, parseInt(id)));

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Error deleting product:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

/**
 * GET /api/admin/orders - Obtener todos los pedidos
 */
router.get('/orders', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    const allOrders = await db.select().from(orders);
    res.json(allOrders);
  } catch (error) {
    console.error('[Admin] Error fetching orders:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

/**
 * PUT /api/admin/orders/:id - Actualizar estado del pedido
 */
router.put('/orders/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, notes } = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    await db
      .update(orders)
      .set({
        orderStatus,
        notes,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, parseInt(id)));

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Error updating order:', error);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

export default router;
