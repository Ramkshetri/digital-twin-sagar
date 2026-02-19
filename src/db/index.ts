import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// This connects to Neon using the secure Edge-compatible HTTP driver
const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql);