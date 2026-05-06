import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: {
      likes: "desc",
    },
  });

  return NextResponse.json(photos);
}