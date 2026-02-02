import { hashPassword, verifyPassword } from './auth';

// Test de hashing
const password = 'Admin123!';
const hash = hashPassword(password);
console.log('Password:', password);
console.log('Hash:', hash);

// Test de verificación
const isValid = verifyPassword(password, hash);
console.log('Is valid:', isValid);

// Test con hash incorrecto
const isInvalid = verifyPassword('WrongPassword', hash);
console.log('Is invalid (should be false):', isInvalid);
