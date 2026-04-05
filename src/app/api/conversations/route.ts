import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId");

    // userId is required - "null" string means null userId for anonymous
    if (userIdParam === null || userIdParam === "") {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Handle "null" string as null userId for anonymous users
    const userId = userIdParam === "null" ? null : userIdParam;

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        participants: {
          include: { philosopher: true },
          orderBy: { position: "asc" },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Transform to match frontend expected shape
    const transformed = conversations.map((conv: typeof conversations[number]) => ({
      id: conv.id,
      title: conv.title || "Untitled",
      philosopherIds: conv.participants.map((p: { philosopherId: string }) => p.philosopherId),
      philosopherNames: conv.participants.map((p: { philosopher: { name: string } }) => p.philosopher.name),
      lastMessage: conv.messages[0]?.content || "",
      updatedAt: conv.updatedAt.toISOString(),
      type: conv.participants.length > 1 ? "debate" : "dialogue",
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, philosopherIds, title } = body;

    if (!userId || !philosopherIds || philosopherIds.length === 0) {
      return NextResponse.json(
        { error: "userId and philosopherIds are required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title: title || `Chat with ${philosopherIds.length} philosopher(s)`,
        participants: {
          create: philosopherIds.map((philosopherId: string, index: number) => ({
            philosopherId,
            position: index,
          })),
        },
      },
      include: {
        participants: {
          include: { philosopher: true },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title } = body;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error updating conversation:", error);
    if (error instanceof Error && error.name === "PrismaClientKnownRequestError" && (error as any).code === "P2025") {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    if (error instanceof Error && error.name === "PrismaClientKnownRequestError" && (error as any).code === "P2025") {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
