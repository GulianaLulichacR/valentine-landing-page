import crypto from 'crypto';

/**
 * Hash una contraseña usando PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifica si una contraseña coincide con su hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, storedHash] = hash.split(':');
  if (!salt || !storedHash) return false;
  
  const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return computedHash === storedHash;
}

/**
 * Genera un token JWT simple para sesión
 */
export function generateToken(userId: number, email: string): string {
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
  };
  
  // Convertir a base64 para simplicidad (en producción usar jsonwebtoken)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    
    // Verificar que no haya expirado
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return { userId: payload.userId, email: payload.email };
  } catch (error) {
    return null;
  }
}
