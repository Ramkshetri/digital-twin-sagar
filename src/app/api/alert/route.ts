import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { ip, type, geo } = await req.json();

    await resend.emails.send({
      from: 'SOC-Lab <onboarding@resend.dev>',
      to: 's8099186@live.vu.edu.au', 
      subject: `🚨 SOC ALERT: Blocked ${type}`,
      html: `
        <div style="font-family: sans-serif; border: 1px solid #333; padding: 20px;">
          <h2 style="color: #e11d48;">Edge WAF Threat Detection</h2>
          <p><strong>Status:</strong> Connection Dropped (403)</p>
          <hr />
          <ul>
            <li><strong>Attacker IP:</strong> ${ip}</li>
            <li><strong>Attack Type:</strong> ${type}</li>
            <li><strong>Location:</strong> ${geo}</li>
          </ul>
          <p><em>Security log recorded in Neon Postgres (Sydney Region).</em></p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error: 'Alert failed' }, { status: 500 });
  }
}