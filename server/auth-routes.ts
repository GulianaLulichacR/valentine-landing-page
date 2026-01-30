import express, { Request, Response } from 'express';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth';

const router = express.Router();

/**
 * Middleware para verificar autenticación
 */
export const authMiddleware = async (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
  
  (req as any).user = payload;
  next();
};

/**
 * Middleware para verificar que sea admin
 */
export const adminMiddleware = async (req: Request, res: Response, next: Function) => {
  const db = await getDb();
  if (!db) {
    return res.status(500).json({ error: 'Base de datos no disponible' });
  }
  
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.userId))
    .limit(1);
  
  if (!dbUser[0] || dbUser[0].role !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos de administrador' });
  }
  
  next();
};

/**
 * POST /api/auth/register - Registrar nuevo admin
 * Solo se puede registrar un admin inicial
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }
    
    // Verificar si ya existe un admin
    const existingAdmins = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'));
    
    if (existingAdmins.length > 0) {
      return res.status(403).json({ error: 'Ya existe un administrador registrado' });
    }
    
    // Verificar si el email ya existe
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Crear admin
    const passwordHash = hashPassword(password);
    const result = await db.insert(users).values({
      email,
      name: name || 'Administrador',
      passwordHash,
      role: 'admin',
    });
    
    res.status(201).json({
      success: true,
      message: 'Administrador registrado exitosamente',
      adminId: result.insertId,
    });
  } catch (error) {
    console.error('[Auth] Error registering admin:', error);
    res.status(500).json({ error: 'Error al registrar administrador' });
  }
});

/**
 * POST /api/auth/login - Login de admin
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }
    
    // Buscar usuario
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!dbUser[0]) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    // Verificar contraseña
    if (!dbUser[0].passwordHash || !verifyPassword(password, dbUser[0].passwordHash)) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    // Verificar que sea admin
    if (dbUser[0].role !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden acceder' });
    }
    
    // Generar token
    const token = generateToken(dbUser[0].id, dbUser[0].email!);
    
    // Actualizar último login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, dbUser[0].id));
    
    res.json({
      success: true,
      token,
      user: {
        id: dbUser[0].id,
        email: dbUser[0].email,
        name: dbUser[0].name,
        role: dbUser[0].role,
      },
    });
  } catch (error) {
    console.error('[Auth] Error logging in:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

/**
 * GET /api/auth/me - Obtener información del usuario actual
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const db = await getDb();
    
    if (!db) {
      return res.status(500).json({ error: 'Base de datos no disponible' });
    }
    
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.userId))
      .limit(1);
    
    if (!dbUser[0]) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({
      id: dbUser[0].id,
      email: dbUser[0].email,
      name: dbUser[0].name,
      role: dbUser[0].role,
    });
  } catch (error) {
    console.error('[Auth] Error fetching user:', error);
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
});

export default router;
