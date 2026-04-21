import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { otpStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    if (otpStore.has(email)) {
      const stored = otpStore.get(email);
      if (stored) {
        if (Date.now() > stored.expires) {
          otpStore.delete(email);
          return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 401 });
        }
        if (stored.code !== otp) {
          return NextResponse.json({ error: "Invalid OTP." }, { status: 401 });
        }
        otpStore.delete(email);
      }
    } else {
      console.warn("OTP Store miss. The OTP might have expired or memory reset.");
      return NextResponse.json({ error: "Verification session missing. Please request a new code." }, { status: 401 });
    }

    // Generate admin session token (valid for 4 hours)
    const secret = process.env.JWT_SECRET || "nexus-super-secret-production-key-v2";
    const token = jwt.sign(
      { email, role: "admin", verified2FA: true },
      secret,
      { expiresIn: "4h" }
    );

    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
