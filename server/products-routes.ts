import express, { Request, Response } from 'express';
import { getDb } from './db';
import { products } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from './auth-routes';

const router = express.Router();

/**
 * GET /api/products - Obtener todos los productos (público)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    console.error('[Products] Error fetching products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

/**
 * GET /api/products/:id - Obtener un producto específico (público)
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (!product[0]) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product[0]);
  } catch (error) {
    console.error('[Products] Error fetching product:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

/**
 * POST /api/products - Crear un nuevo producto (admin)
 */
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, category, stock, featured, complements } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    const result = await db.insert(products).values({
      name,
      description: description || '',
      price: price.toString(),
      imageUrl: imageUrl || '',
      category: category || 'San Valentin',
      stock: stock || 0,
      featured: featured ? 1 : 0,
      complements: complements ? JSON.stringify(complements) : null,
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      productId: (result[0] as any).insertId,
    });
  } catch (error) {
    console.error('[Products] Error creating product:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

/**
 * PUT /api/products/:id - Actualizar un producto (admin)
 */
router.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, stock, featured, complements } = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    // Verificar que el producto existe
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (!existingProduct[0]) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar producto
    await db
      .update(products)
      .set({
        name: name || existingProduct[0].name,
        description: description !== undefined ? description : existingProduct[0].description,
        price: price ? price.toString() : existingProduct[0].price,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct[0].imageUrl,
        category: category || existingProduct[0].category,
        stock: stock !== undefined ? stock : existingProduct[0].stock,
        featured: featured !== undefined ? (featured ? 1 : 0) : existingProduct[0].featured,
        complements: complements ? JSON.stringify(complements) : existingProduct[0].complements,
      })
      .where(eq(products.id, parseInt(id)));

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
    });
  } catch (error) {
    console.error('[Products] Error updating product:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

/**
 * DELETE /api/products/:id - Eliminar un producto (admin)
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    // Verificar que el producto existe
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (!existingProduct[0]) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar producto
    await db.delete(products).where(eq(products.id, parseInt(id)));

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    console.error('[Products] Error deleting product:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;
