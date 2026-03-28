import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const philosophers = await prisma.philosopher.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(philosophers);
  } catch (error) {
    console.error("Error fetching philosophers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
