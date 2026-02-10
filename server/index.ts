import express from "express";
import { createOrder, logAudit, getOrderById, getAllOrders } from "./db";
import * as schema from "../drizzle/schema";
import authRoutes from "./auth-routes";
import productsRoutes from "./products-routes";
import uploadRoutes from "./upload-routes";
import statsRoutes from "./stats-routes";
import adminRoutes from "./admin-routes";
import settingsRoutes from "./settings-routes";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(fileUpload());

// Servir archivos estáticos de uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Registrar rutas de autenticación
app.use("/api/auth", authRoutes);

// Registrar rutas de productos
app.use("/api/products", productsRoutes);

// Registrar rutas de upload
app.use("/api/upload", uploadRoutes);

// Registrar rutas de estadísticas
app.use("/api/stats", statsRoutes);

// Registrar rutas de administración
app.use("/api/admin", adminRoutes);

// Registrar rutas de configuración
app.use("/api/admin", settingsRoutes);

// Rutas para gestión de pedidos
app.post("/api/orders", async (req, res) => {
  try {
    const {
      productId,
      productName,
      productPrice,
      senderName,
      senderEmail,
      senderPhone,
      recipientName,
      message,
      deliveryDate,
      termsAccepted,
      noRefundPolicy,
    } = req.body;

    // Validaciones
    if (!senderName || !recipientName || !deliveryDate || !termsAccepted) {
      return res.status(400).json({
        error: "Faltan campos requeridos",
      });
    }

    if (!termsAccepted || !noRefundPolicy) {
      return res.status(400).json({
        error: "Debes aceptar los términos y condiciones",
      });
    }

    // Crear pedido
    const orderData: schema.InsertOrder = {
      productId,
      productName,
      productPrice: productPrice.toString(),
      senderName,
      senderEmail,
      senderPhone,
      recipientName,
      message,
      deliveryDate,
      termsAccepted: termsAccepted ? 1 : 0,
      noRefundPolicy: noRefundPolicy ? 1 : 0,
      minDeliveryDays: 2,
      paymentStatus: "pending",
      orderStatus: "pending",
    };

    const result = await createOrder(orderData);

    // Registrar en auditoría
    await logAudit({
      action: "ORDER_CREATED",
      entityType: "order",
      entityId: result.insertId,
      changes: JSON.stringify(orderData),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(201).json({
      success: true,
      orderId: result.insertId,
      message: "Pedido creado exitosamente",
    });
  } catch (error) {
    console.error("[Orders] Error creating order:", error);
    res.status(500).json({
      error: "Error al crear el pedido",
    });
  }
});

// Obtener todos los pedidos (solo admin)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("[Orders] Error fetching orders:", error);
    res.status(500).json({
      error: "Error al obtener los pedidos",
    });
  }
});

// Obtener un pedido específico
app.get("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(parseInt(id));

    if (!order) {
      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("[Orders] Error fetching order:", error);
    res.status(500).json({
      error: "Error al obtener el pedido",
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Server] Auth routes registered at /api/auth`);
  console.log(`[Server] Static uploads served at /uploads`);
});
