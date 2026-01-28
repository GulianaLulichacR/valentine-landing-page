import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import * as schema from "../drizzle/schema";

let db: any = null;

export async function getDb() {
  if (!db && process.env.DATABASE_URL) {
    try {
      const connection = await createConnection(process.env.DATABASE_URL);
      db = drizzle(connection, { schema, mode: "default" });
    } catch (error) {
      console.error("[Database] Connection failed:", error);
      throw error;
    }
  }
  return db;
}

// Funciones de utilidad para pedidos
export async function createOrder(orderData: schema.InsertOrder) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database.insert(schema.orders).values(orderData);
  return result;
}

export async function getOrderById(id: number) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, id))
    .limit(1);
  
  return result[0];
}

export async function getAllOrders() {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database.select().from(schema.orders);
  return result;
}

export async function updateOrderStatus(id: number, status: schema.Order["orderStatus"]) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database
    .update(schema.orders)
    .set({ orderStatus: status, updatedAt: new Date() })
    .where(eq(schema.orders.id, id));
  
  return result;
}

export async function updatePaymentStatus(id: number, status: schema.Order["paymentStatus"]) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database
    .update(schema.orders)
    .set({ paymentStatus: status, updatedAt: new Date() })
    .where(eq(schema.orders.id, id));
  
  return result;
}

// Funciones para pagos
export async function createPayment(paymentData: schema.InsertPayment) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database.insert(schema.payments).values(paymentData);
  return result;
}

export async function getPaymentsByOrderId(orderId: number) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.orderId, orderId));
  
  return result;
}

// Funciones de auditoría
export async function logAudit(auditData: schema.InsertAuditLog) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database.insert(schema.auditLog).values(auditData);
  return result;
}

export async function getAuditLogs(limit = 100) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");
  
  const result = await database
    .select()
    .from(schema.auditLog)
    .limit(limit);
  
  return result;
}
