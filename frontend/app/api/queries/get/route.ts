import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { getCurrentUser } from "../../auth/me/route";

export async function GET() {
  const userId = await getCurrentUser();
  if (!userId) return NextResponse.json([], { status: 401 });

  const queries = await prisma.generatedQuery.findMany({
    where: { userId: userId },
    orderBy: { created_at: 'desc' }
  });

  return NextResponse.json(queries);
}