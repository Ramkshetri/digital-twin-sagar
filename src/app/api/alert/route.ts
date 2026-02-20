import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// Swap these two lines to use relative paths instead of the @ alias
import { db } from '../../../db'; 
import { threatLogs } from '../../../db/schema';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attackType, ip = "Unknown IP", payload, geo = "Unknown Region" } = body;

    // 1. SAVE TO NEON DATABASE
    try {
      await db.insert(threatLogs).values({
        ipAddress: ip,
        geoRegion: geo,
        userAgent: payload, // Storing the payload info here
        attackType: attackType,
        blocked: true,
      });
    } catch (dbError) {
      console.error("Database insert failed:", dbError);
      // We don't return here so the email still sends even if DB fails
    }

    // 2. SEND THE RESEND EMAIL
    await resend.emails.send({
      from: 'SOC-Lab <onboarding@resend.dev>',
      to: 's8099186@live.vu.edu.au',
      subject: `🚨 SOC ALERT: Blocked ${attackType}`,
      html: `
        <div style="font-family: sans-serif; border: 1px solid #333; padding: 20px;">
          <h2 style="color: #e11d48;">Edge WAF Threat Detection</h2>
          <p><strong>Status:</strong> Connection Dropped (403)</p>
          <ul>
            <li><strong>Attacker IP:</strong> ${ip}</li>
            <li><strong>Geo-Location:</strong> ${geo}</li>
            <li><strong>Attack Type:</strong> ${attackType}</li>
            <li><strong>Details:</strong> ${payload}</li>
          </ul>
        </div>
      `
    });

    return NextResponse.json(
      { success: true, message: "Threat logged and admin alerted." },
      { status: 200 } // Return 200 here because the API succeeded. The middleware handles the 403 block.
    );

  } catch (error) {
    console.error("Alert failed:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}