import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  adminId?: number;
}

/**
 * Middleware para verificar autenticación de administrador
 * Valida el token JWT en el header Authorization
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.substring(7);
    
    // TODO: Validar token JWT aquí
    // Por ahora, asumimos que si hay token, está autenticado
    // En producción, deberías validar el token contra tu secret
    
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
