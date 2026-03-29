import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { chat, ChatMessage } from "@/lib/ai";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId required" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, philosopherIds, message, provider, userId } = body;

    if (!philosopherIds || !message) {
      return NextResponse.json(
        { error: "Missing required fields: philosopherIds and message are required" },
        { status: 400 }
      );
    }

    // Validate provider
    if (provider && provider !== "openai" && provider !== "anthropic") {
      return NextResponse.json(
        { error: "Invalid provider. Must be 'openai' or 'anthropic'" },
        { status: 400 }
      );
    }

    // If conversationId not provided, create a new conversation first
    let convId = conversationId;
    let philosophers;
    if (!convId) {
      const userIdToUse = userId || null;
      philosophers = await prisma.philosopher.findMany({
        where: { id: { in: philosopherIds } },
      });
      const title = philosophers.length === 1
        ? `Dialogue with ${philosophers[0].name}`
        : `Debate: ${philosophers.map((p: { name: string }) => p.name).join(" vs ")}`;
      const conv = await prisma.conversation.create({
        data: {
          userId: userIdToUse,
          title,
          participants: {
            create: philosopherIds.map((philosopherId: string, index: number) => ({
              philosopherId,
              position: index,
            })),
          },
        },
      });
      convId = conv.id;
    } else {
      philosophers = await prisma.philosopher.findMany({
        where: { id: { in: philosopherIds } },
      });
    }

    if (philosophers.length === 0) {
      return NextResponse.json(
        { error: "No philosophers found" },
        { status: 404 }
      );
    }

    const existingMessages = await prisma.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "asc" },
    });

    const chatHistory: ChatMessage[] = existingMessages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    chatHistory.push({ role: "user", content: message });

    // Save user message once (outside Promise.all to avoid duplicate saves)
    await prisma.message.create({
      data: {
        conversationId: convId!,
        role: "user",
        content: message,
      },
    });

    const results = await Promise.all(
      philosophers.map(async (philosopher: { id: string; name: string; systemPrompt: string }) => {
        try {
          const response = await chat(chatHistory, philosopher.systemPrompt, provider);

          await prisma.message.create({
            data: {
              conversationId: convId!,
              role: "assistant",
              content: response,
            },
          });

          return {
            conversationId: convId,
            philosopherId: philosopher.id,
            philosopherName: philosopher.name,
            response,
            error: null,
          };
        } catch (err) {
          return {
            conversationId: convId,
            philosopherId: philosopher.id,
            philosopherName: philosopher.name,
            response: null,
            error: err instanceof Error ? err.message : "Unknown error",
          };
        }
      })
    );

    return NextResponse.json({ results, conversationId: convId });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
