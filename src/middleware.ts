// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || 'unknown';

  // 1. BLOCK KNOWN BAD BOTS (The "Firewall" Rule)
  // Simple check for common scanner tools
  if (userAgent.includes('sqlmap') || userAgent.includes('nikto') || userAgent.includes('curl')) {
    console.log(`BLOCKED ATTACK from IP: ${ip}, Tool: ${userAgent}`);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Access Denied: Malicious User Agent Detected' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    );
  }

  // 2. GEO-BLOCKING SIMULATION (Optional)
  // In a real pro plan, Vercel does this. Here we log it.
  console.log(`INCOMING TRAFFIC: ${request.geo?.country} - ${ip}`);

  return NextResponse.next();
}

// Apply to all routes
export const config = {
  matcher: '/:path*',
};