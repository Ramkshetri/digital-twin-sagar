// src/app/api/threat-detect/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attackType, ip = "Visitor (Web UI)", payload } = body;

    // 1. Send the Email Alert to YOU
    await resend.emails.send({
      from: 'SOC-Lab <onboarding@resend.dev>',
      to: 's8099186@live.vu.edu.au', // Your verified Resend email
      subject: `🚨 SOC ALERT: Blocked ${attackType}`,
      html: `
        <div style="font-family: sans-serif; border: 1px solid #333; padding: 20px;">
          <h2 style="color: #e11d48;">Edge WAF Threat Detection</h2>
          <p><strong>Status:</strong> Connection Dropped (403)</p>
          <hr />
          <ul>
            <li><strong>Attacker IP:</strong> ${ip}</li>
            <li><strong>Attack Type:</strong> ${attackType}</li>
            <li><strong>Payload:</strong> ${payload}</li>
          </ul>
          <p><em>Security log recorded in Digital Twin III.</em></p>
        </div>
      `
    });

    // 2. Return the "Block" response to the VISITOR's Terminal
    return NextResponse.json(
      { success: false, message: "403 FORBIDDEN: Malicious Payload Detected. Admin has been alerted." },
      { status: 403 }
    );

  } catch (error) {
    console.error("Alert failed:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}