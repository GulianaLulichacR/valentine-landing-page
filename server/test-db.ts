import { getDb } from './db';
import { admins } from '../drizzle/schema';
import { hashPassword } from './auth';

async function testDb() {
  try {
    console.log('Connecting to database...');
    const db = await getDb();
    
    if (!db) {
      console.error('Failed to connect to database');
      return;
    }
    
    console.log('Database connected successfully');
    
    // Test insert
    const passwordHash = hashPassword('TestPassword123!');
    console.log('Inserting admin with email: test@example.com');
    
    const result = await db.insert(admins).values({
      email: 'test@example.com',
      name: 'Test Admin',
      passwordHash,
    });
    
    console.log('Insert result:', result);
    
    // Test select
    const allAdmins = await db.select().from(admins);
    console.log('All admins:', allAdmins);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testDb();
