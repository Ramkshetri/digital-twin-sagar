import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from './db';
import { threatLogs } from './db/schema';
export async function middleware(request: NextRequest) {
  // 1. Extract attacker telemetry
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  
  // Vercel securely provides the IP and Geo-location automatically
  const ip = request.ip || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'Unknown IP';
  const geo = request.geo?.country || 'Unknown Region';

  // 2. Define our Threat Intelligence Rule
  const ua = userAgent.toLowerCase();
  
  let attackDetected = false;
  let attackSignature = '';

  if (ua.includes('sqlmap')) {
    attackDetected = true;
    attackSignature = 'SQL_INJECTION_SCANNER (sqlmap)';
  } else if (ua.includes('nmap')) {
    attackDetected = true;
    attackSignature = 'NETWORK_RECONNAISSANCE (nmap)';
  } else if (ua.includes('nikto')) {
    attackDetected = true;
    attackSignature = 'WEB_VULNERABILITY_SCANNER (nikto)';
  }

  // 3. The "Log and Drop" Action
  if (attackDetected) {
    try {
      await db.insert(threatLogs).values({
        ipAddress: ip,
        geoRegion: geo,
        userAgent: userAgent,
        attackType: attackSignature,
        blocked: true,
      });
      console.log(`[DEFENSE ACTIVE] Logged ${attackSignature} from ${ip}`);
    } catch (error) {
      // If the database fails, we still want to block the attacker!
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