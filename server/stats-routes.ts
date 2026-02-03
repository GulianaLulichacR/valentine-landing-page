import express, { Router, Request, Response } from 'express';
import { getDb } from './db';
import { orders, products } from '../drizzle/schema';
import { sql } from 'drizzle-orm';

const router = Router();

// Middleware de autenticación
const authMiddleware = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

router.use(authMiddleware);

// Obtener estadísticas generales
router.get('/overview', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Total de pedidos
    const totalOrdersResult = await db.execute(
      sql`SELECT COUNT(*) as count FROM orders`
    );
    const totalOrders = (totalOrdersResult as any)[0]?.count || 0;

    // Total de ventas
    const totalSalesResult = await db.execute(
      sql`SELECT SUM(CAST(productPrice AS DECIMAL(10,2))) as total FROM orders`
    );
    const totalSales = parseFloat((totalSalesResult as any)[0]?.total || 0);

    // Total de productos
    const totalProductsResult = await db.execute(
      sql`SELECT COUNT(*) as count FROM products`
    );
    const totalProducts = (totalProductsResult as any)[0]?.count || 0;

    // Pedidos pendientes
    const pendingOrdersResult = await db.execute(
      sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`
    );
    const pendingOrders = (pendingOrdersResult as any)[0]?.count || 0;

    res.json({
      totalOrders,
      totalSales,
      totalProducts,
      pendingOrders,
    });
  } catch (error) {
    console.error('[Stats] Error fetching overview:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Obtener ventas por día (últimos 30 días)
router.get('/sales-by-day', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const result = await db.execute(
      sql`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as orders,
          SUM(CAST(productPrice AS DECIMAL(10,2))) as sales
        FROM orders
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `
    );

    const data = (result as any).map((row: any) => ({
      date: row.date ? new Date(row.date).toLocaleDateString('es-ES') : 'N/A',
      orders: row.orders || 0,
      sales: parseFloat(row.sales || 0),
    }));

    res.json(data);
  } catch (error) {
    console.error('[Stats] Error fetching sales by day:', error);
    res.status(500).json({ error: 'Error al obtener ventas por día' });
  }
});

// Obtener productos más vendidos
router.get('/top-products', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const result = await db.execute(
      sql`
        SELECT 
          productName,
          COUNT(*) as sales,
          SUM(CAST(productPrice AS DECIMAL(10,2))) as revenue
        FROM orders
        GROUP BY productName
        ORDER BY sales DESC
        LIMIT 10
      `
    );

    const data = (result as any).map((row: any) => ({
      name: row.productName,
      sales: row.sales || 0,
      revenue: parseFloat(row.revenue || 0),
    }));

    res.json(data);
  } catch (error) {
    console.error('[Stats] Error fetching top products:', error);
    res.status(500).json({ error: 'Error al obtener productos más vendidos' });
  }
});

// Obtener estado de pedidos
router.get('/orders-status', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const result = await db.execute(
      sql`
        SELECT 
          status,
          COUNT(*) as count
        FROM orders
        GROUP BY status
      `
    );

    const data = (result as any).map((row: any) => ({
      name: row.status || 'unknown',
      value: row.count || 0,
    }));

    res.json(data);
  } catch (error) {
    console.error('[Stats] Error fetching orders status:', error);
    res.status(500).json({ error: 'Error al obtener estado de pedidos' });
  }
});

// Obtener últimos pedidos
router.get('/recent-orders', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const result = await db.execute(
      sql`
        SELECT 
          id,
          productName,
          senderName,
          CAST(productPrice AS DECIMAL(10,2)) as productPrice,
          status,
          createdAt
        FROM orders
        ORDER BY createdAt DESC
        LIMIT 10
      `
    );

    const data = (result as any).map((row: any) => ({
      id: row.id,
      productName: row.productName,
      senderName: row.senderName,
      price: parseFloat(row.productPrice || 0),
      status: row.status || 'pending',
      date: row.createdAt ? new Date(row.createdAt).toLocaleDateString('es-ES') : 'N/A',
    }));

    res.json(data);
  } catch (error) {
    console.error('[Stats] Error fetching recent orders:', error);
    res.status(500).json({ error: 'Error al obtener últimos pedidos' });
  }
});

export default router;
