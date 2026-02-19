"use server";

import { db } from '../db';
import { threatLogs } from '../db/schema';
import { desc } from 'drizzle-orm';

export async function getRecentThreats() {
  try {
    // Fetch the 5 most recent blocked attacks, ordered by newest first
    const logs = await db.select()
      .from(threatLogs)
      .orderBy(desc(threatLogs.timestamp))
      .limit(5);
      
    return logs;
  } catch (error) {
    console.error("Failed to fetch threats:", error);
    return [];
  }
}