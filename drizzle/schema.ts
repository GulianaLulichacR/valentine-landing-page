import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Tabla de Usuarios
 * Almacena información de clientes y administradores
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", ["customer", "admin"]).default("customer"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabla de Productos
 * Almacena información de los regalos disponibles
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  category: varchar("category", { length: 100 }).default("San Valentin"),
  stock: int("stock").default(0),
  featured: int("featured").default(0),
  complements: json("complements"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Tabla de Pedidos
 * Almacena todos los pedidos realizados por los clientes
 * Incluye información de pago, términos y condiciones, y estado del pedido
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  
  // Información del producto
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productPrice: decimal("productPrice", { precision: 10, scale: 2 }).notNull(),
  
  // Información del cliente
  senderName: varchar("senderName", { length: 255 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 255 }),
  senderPhone: varchar("senderPhone", { length: 20 }),
  recipientName: varchar("recipientName", { length: 255 }).notNull(),
  message: text("message"),
  deliveryDate: varchar("deliveryDate", { length: 50 }).notNull(),
  
  // Información de pago
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "confirmed", "failed", "refunded"]).default("pending"),
  paymentMethod: varchar("paymentMethod", { length: 100 }),
  paymentDate: timestamp("paymentDate"),
  transactionId: varchar("transactionId", { length: 255 }),
  
  // Términos y condiciones
  termsAccepted: int("termsAccepted").default(0).notNull(),
  minDeliveryDays: int("minDeliveryDays").default(2).notNull(),
  noRefundPolicy: int("noRefundPolicy").default(1).notNull(),
  
  // Estado del pedido
  orderStatus: mysqlEnum("orderStatus", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  notes: text("notes"),
  
  // Auditoría
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Tabla de Pagos
 * Registro detallado de todas las transacciones de pago
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("PEN"),
  paymentMethod: varchar("paymentMethod", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  transactionId: varchar("transactionId", { length: 255 }).unique(),
  description: text("description"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Tabla de Auditoría
 * Registro de todas las acciones importantes para seguridad y cumplimiento
 */
export const auditLog = mysqlTable("auditLog", {
  id: int("id").autoincrement().primaryKey(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: int("entityId"),
  userId: int("userId"),
  changes: json("changes"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;
