import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// In-memory OTP store (per server instance)
const otpStore = new Map<string, { code: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(email, { code: otp, expires: expiresAt });
    
    // Optional: Share globally via environment variable to support local dev HMR
    (global as any).__OTP_STORE__ = otpStore;

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"NEXUS SECURITY" <${process.env.EMAIL_USER}>`,
      to: email, // ensure we mail to the requested email (admin)
      subject: `[ACTION REQUIRED] Nexus Admin Clearance Code: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #080808; color: #ffffff; font-family: 'Space Grotesk', sans-serif; -webkit-font-smoothing: antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #080808; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #0c0a08; border: 1px solid rgba(201,169,110,0.15); border-radius: 12px; box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8); overflow: hidden;">
                  
                  <!-- HEADER -->
                  <tr>
                    <td style="padding: 40px 40px; border-bottom: 1px solid rgba(201,169,110,0.1); background: radial-gradient(circle at top, rgba(201,169,110,0.08) 0%, transparent 100%); text-align: center;">
                      <h1 style="font-family: 'Playfair Display', serif; font-weight: 700; margin: 0; font-size: 28px; letter-spacing: -1px; color: #C9A96E;">Access<br/><span style="font-style: italic; color: #fff;">Clearance.</span></h1>
                    </td>
                  </tr>

                  <!-- BODY -->
                  <tr>
                    <td style="padding: 40px; text-align: center;">
                      <p style="margin: 0 0 24px 0; font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; letter-spacing: 0.5px; font-family: 'Space Grotesk', sans-serif;">
                        An authentication request was initiated for the primary Nexus terminal. Provide the following cipher to confirm authority.
                      </p>
                      
                      <!-- OTP BOX -->
                      <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(201, 169, 110, 0.2); padding: 24px 40px; border-radius: 8px; margin: 0 auto; display: inline-block;">
                        <span style="font-family: monospace; font-size: 38px; font-weight: 700; letter-spacing: 16px; color: #C9A96E; text-shadow: 0 0 24px rgba(201,169,110,0.3); margin-right: -16px;">${otp}</span>
                      </div>

                      <p style="margin: 30px 0 0 0; font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace;">
                        Cipher invalidates in <span style="color: #C9A96E;">5 minutes</span>.
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #050505; border-top: 1px solid rgba(255,255,255,0.03); text-align: center;">
                      <p style="margin: 0; font-size: 9px; color: rgba(255,255,255,0.2); font-family: monospace; text-transform: uppercase; letter-spacing: 2px;">
                        01 THE ARCHITECT · STRICT ZERO-TRUST
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent to your email." });
  } catch (error: any) {
    console.error("OTP SMTP Send Error Breakdown:", {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    return NextResponse.json({ error: `SMTP Failed: ${error.message || "Unknown Error"}` }, { status: 500 });
  }
}

export { otpStore };
