import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { getCurrentUser } from "../../auth/me/route";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    // Safety check: Ensure we have a user and extract the ID specifically
    // (Assuming user object has an 'id' field)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { guestHistory } = body;

    if (!guestHistory || !Array.isArray(guestHistory) || guestHistory.length === 0) {
      return NextResponse.json({ message: "Nothing to sync" }, { status: 200 });
    }

    // --- FIX: Map Frontend keys to Database keys ---
    const formattedData = guestHistory
      .filter((item: any) => item.type === "EXPLAIN") // Only sync "EXPLAIN" types
      .map((item: any) => ({
        original_query: item.query,          // Frontend key is 'query'
        explanation: item.processedData,     // Frontend key is 'processedData'
        userId: user,                       // Use the extracted .id
        created_at: new Date(item.timestamp),
      }));

    if (formattedData.length > 0) {
      await prisma.explainedQuery.createMany({
        data: formattedData,
        skipDuplicates: true, // Optional: prevents crashing if IDs collide
      });
    }

    return NextResponse.json({ success: true, count: formattedData.length }, { status: 200 });

  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}