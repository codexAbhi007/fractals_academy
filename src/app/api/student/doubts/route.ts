import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { doubt } from "@/db/schema";
import { nanoid } from "nanoid";
import { getServerSession, getCurrentUser } from "@/lib/session";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Get all doubts for the current user
    const doubts = await db
      .select()
      .from(doubt)
      .where(eq(doubt.userId, user.id))
      .orderBy(desc(doubt.createdAt));

    return NextResponse.json(doubts);
  } catch (error) {
    console.error("[DOUBTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch doubts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, questionId, videoId } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    // Create the doubt
    const [newDoubt] = await db
      .insert(doubt)
      .values({
        id: nanoid(),
        userId: user.id,
        title,
        description,
        questionId: questionId || null,
        videoId: videoId || null,
        status: "PENDING",
      })
      .returning();

    return NextResponse.json(newDoubt, { status: 201 });
  } catch (error) {
    console.error("[DOUBT_POST]", error);
    return NextResponse.json(
      { error: "Failed to submit doubt" },
      { status: 500 },
    );
  }
}
