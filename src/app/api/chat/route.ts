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
    const { conversationId, philosopherIds, message, provider } = body;

    if (!conversationId || !philosopherIds || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const philosophers = await prisma.philosopher.findMany({
      where: { id: { in: philosopherIds } },
    });

    if (philosophers.length === 0) {
      return NextResponse.json(
        { error: "No philosophers found" },
        { status: 404 }
      );
    }

    const existingMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    const chatHistory: ChatMessage[] = existingMessages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    chatHistory.push({ role: "user", content: message });

    const results = await Promise.all(
      philosophers.map(async (philosopher: { id: string; systemPrompt: string }) => {
        try {
          const response = await chat(chatHistory, philosopher.systemPrompt, provider);

          await prisma.message.create({
            data: {
              conversationId,
              role: "user",
              content: message,
            },
          });

          await prisma.message.create({
            data: {
              conversationId,
              role: "assistant",
              content: response,
            },
          });

          return {
            philosopherId: philosopher.id,
            response,
            error: null,
          };
        } catch (err) {
          return {
            philosopherId: philosopher.id,
            response: null,
            error: err instanceof Error ? err.message : "Unknown error",
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
