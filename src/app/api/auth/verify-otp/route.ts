// src/app/api/auth/verify-otp/route.ts
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const record = await prisma.oTP.findFirst({
    where: {
      email,
      code,
      verified: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!record) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  // mark OTP used
  await prisma.oTP.update({
    where: { id: record.id },
    data: { verified: true },
  });

  // upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: { isVerified: true },
    create: {
      email,
      isVerified: true,
    },
  });

  return NextResponse.json({ message: "Verified", userId: user.id });
}