import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { ip, type, geo } = await req.json();

    await resend.emails.send({
      from: 'SOC-Lab <onboarding@resend.dev>',
      to: ['your-email@example.com'], // CHANGE THIS TO YOUR ACTUAL EMAIL
      subject: `🚨 SOC ALERT: Blocked ${type}`,
      html: `
        <h2>Edge WAF Threat Detection</h2>
        <p><strong>Status:</strong> Connection Dropped (403)</p>
        <ul>
          <li><strong>Attacker IP:</strong> ${ip}</li>
          <li><strong>Attack Type:</strong> ${type}</li>
          <li><strong>Location:</strong> ${geo}</li>
        </ul>
        <p><em>This alert was triggered by your Digital Twin III Security Pipeline.</em></p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Alert failed' }, { status: 500 });
  }
}