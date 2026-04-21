import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "@/lib/store";

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

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your verification code: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; color: #333; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                  
                  <!-- HEADER -->
                  <tr>
                    <td style="padding: 32px 40px; border-bottom: 1px solid #eee; text-align: left;">
                      <h1 style="font-family: 'Inter', sans-serif; font-weight: 700; margin: 0; font-size: 20px; color: #111;">Admin Verification</h1>
                      <p style="margin: 4px 0 0 0; font-size: 13px; color: #888;">biswadeeptewari.dev</p>
                    </td>
                  </tr>

                  <!-- BODY -->
                  <tr>
                    <td style="padding: 40px; text-align: center;">
                      <p style="margin: 0 0 24px 0; font-size: 14px; color: #555; line-height: 1.6; text-align: left;">
                        A sign-in attempt was made to the admin panel. Use the code below to complete verification.
                      </p>
                      
                      <!-- OTP BOX -->
                      <div style="background: #f8f8f8; border: 1px solid #e5e5e5; padding: 20px 40px; border-radius: 8px; margin: 0 auto; display: inline-block;">
                        <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; letter-spacing: 12px; color: #111; margin-right: -12px;">${otp}</span>
                      </div>

                      <p style="margin: 24px 0 0 0; font-size: 12px; color: #999;">
                        This code expires in <strong style="color: #333;">5 minutes</strong>. If you didn't request this, you can ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #eee; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #bbb;">
                        Biswadeep Tewari &middot; Portfolio Admin
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
