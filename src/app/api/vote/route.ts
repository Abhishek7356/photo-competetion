import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, photoId } = await req.json();

    // 1. Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isVerified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check already voted
    if (user.hasVoted) {
      return NextResponse.json({ error: "Already voted" }, { status: 400 });
    }

    // 3. Create vote + increment like (transaction)
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          userId,
          photoId,
        },
      }),
      prisma.photo.update({
        where: { id: photoId },
        data: {
          likes: {
            increment: 1,
          },
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          hasVoted: true,
        },
      }),
    ]);

    return NextResponse.json({ message: "Vote counted" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}