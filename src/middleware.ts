import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from './src/db';
import { threatLogs } from './src/db/schema';

export async function middleware(request: NextRequest) {
  // 1. Extract attacker telemetry
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  
  // Vercel securely provides the IP and Geo-location automatically
  const ip = request.ip || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'Unknown IP';
  const geo = request.geo?.country || 'Unknown Region';

  // 2. Define our Threat Intelligence Rule
  const isSqlmap = userAgent.toLowerCase().includes('sqlmap');

  // 3. The "Log and Drop" Action
  if (isSqlmap) {
    try {
      // Send the telemetry to our Neon Database instantly
      await db.insert(threatLogs).values({
        ipAddress: ip,
        geoRegion: geo,
        userAgent: userAgent,
        attackType: 'SQL_INJECTION_SCANNER (sqlmap)',
        blocked: true,
      });
      console.log(`[DEFENSE ACTIVE] Logged sqlmap attack from ${ip}`);
    } catch (error) {
      console.error('Failed to write threat log to DB:', error);
    }

    // Drop the connection with a 403 Forbidden status
    return NextResponse.json(
      { success: false, message: "Access Denied by WAF: Malicious Scanner Detected", flag: "FLAG{layer_7_edge_defense_active}" },
      { status: 403 }
    );
  }

  // If traffic is clean, let it pass to the website
  return NextResponse.next();
}

export const config = {
  // Only run the firewall on actual pages and APIs, not on images/CSS
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};