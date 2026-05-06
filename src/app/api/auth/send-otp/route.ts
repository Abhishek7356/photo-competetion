// src/app/api/auth/send-otp/route.ts
import { prisma } from "../../../lib/prisma";
import { generateOTP } from "../../../lib/otp";
import { sendOTPEmail } from "../../../lib/mailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await prisma.oTP.create({
    data: {
      email,
      code: otp,
      expiresAt,
    },
  });

  await sendOTPEmail(email, otp);

  return NextResponse.json({ message: "OTP sent" });
}