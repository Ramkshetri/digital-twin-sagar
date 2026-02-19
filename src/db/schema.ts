import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// This table mimics a real SOC Security Event log
export const threatLogs = pgTable('threat_logs', {
  id: serial('id').primaryKey(),
  ipAddress: text('ip_address').notNull(),
  geoRegion: text('geo_region'),
  userAgent: text('user_agent'),
  attackType: text('attack_type').notNull(), // e.g., 'SQL_INJECTION', 'BOT_SCAN'
  blocked: boolean('blocked').default(true),
  timestamp: timestamp('timestamp').defaultNow(),
});
