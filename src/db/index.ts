import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use the new variable name to bypass Vercel's locked integration
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

const client = neon(connectionString!);
export const db = drizzle(client);