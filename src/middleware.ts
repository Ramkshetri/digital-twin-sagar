import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const ip = request.ip || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'Unknown IP';
  const geo = request.geo?.country || 'Unknown Region';

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
  } else if (ua.includes('curl')) { 
    attackDetected = true;
    attackSignature = 'UNAUTHORIZED_CLI_TOOL (curl)';
  }

  if (attackDetected) {
    try {
      // Tattle to the Brain (API Route)
      await fetch(`${request.nextUrl.origin}/api/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ip: ip, 
          attackType: attackSignature, 
          payload: `Blocked in Edge WAF. Geo: ${geo}`,
          geo: geo
        }),
      });
    } catch (error) {
      console.error('Failed to trigger alert API:', error);
    }
    
    // Drop the connection immediately
    return NextResponse.json(
      { success: false, message: "Access Denied by WAF: Malicious Scanner Detected" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};