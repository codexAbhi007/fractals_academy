import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videoProgress } from "@/db/schema";
import { nanoid } from "nanoid";
import { getServerSession, getCurrentUser } from "@/lib/session";
import { eq, and } from "drizzle-orm";

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
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 },
      );
    }

    // Check if progress already exists
    const [existing] = await db
      .select()
      .from(videoProgress)
      .where(
        and(
          eq(videoProgress.userId, user.id),
          eq(videoProgress.videoId, videoId),
        ),
      )
      .limit(1);

    if (existing) {
      // Update existing progress to completed
      const [updated] = await db
        .update(videoProgress)
        .set({
          completed: true,
          lastWatchedAt: new Date(),
        })
        .where(eq(videoProgress.id, existing.id))
        .returning();

      return NextResponse.json(updated);
    }

    // Create new progress entry
    const [newProgress] = await db
      .insert(videoProgress)
      .values({
        id: nanoid(),
        userId: user.id,
        videoId,
        completed: true,
        watchedDuration: 0,
      })
      .returning();

    return NextResponse.json(newProgress, { status: 201 });
  } catch (error) {
    console.error("[VIDEO_PROGRESS_POST]", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}

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

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (videoId) {
      // Get progress for specific video
      const [progress] = await db
        .select()
        .from(videoProgress)
        .where(
          and(
            eq(videoProgress.userId, user.id),
            eq(videoProgress.videoId, videoId),
          ),
        )
        .limit(1);

      return NextResponse.json(progress || null);
    }

    // Get all progress for user
    const allProgress = await db
      .select()
      .from(videoProgress)
      .where(eq(videoProgress.userId, user.id));

    return NextResponse.json(allProgress);
  } catch (error) {
    console.error("[VIDEO_PROGRESS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}
