import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  video,
  question,
  questionAttempt,
  videoProgress,
  doubt,
} from "@/db/schema";
import { getServerSession, getCurrentUser } from "@/lib/session";
import { eq, count, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Get total videos
    const [videosResult] = await db.select({ count: count() }).from(video);
    const totalVideos = videosResult?.count || 0;

    // Get videos watched by user
    const [videosWatchedResult] = await db
      .select({ count: count() })
      .from(videoProgress)
      .where(eq(videoProgress.userId, user.id));
    const videosWatched = videosWatchedResult?.count || 0;

    // Get total questions
    const [questionsResult] = await db
      .select({ count: count() })
      .from(question);
    const totalQuestions = questionsResult?.count || 0;

    // Get questions attempted by user
    const attemptsData = await db
      .select({
        total: count(),
        correct: sql<number>`sum(case when ${questionAttempt.isCorrect} then 1 else 0 end)`,
      })
      .from(questionAttempt)
      .where(eq(questionAttempt.userId, user.id));

    const questionsSolved = attemptsData[0]?.total || 0;
    const correctAnswers = Number(attemptsData[0]?.correct) || 0;
    const accuracy =
      questionsSolved > 0
        ? Math.round((correctAnswers / questionsSolved) * 100)
        : 0;

    // Get pending doubts
    const [pendingDoubtsResult] = await db
      .select({ count: count() })
      .from(doubt)
      .where(eq(doubt.userId, user.id));
    const pendingDoubts = pendingDoubtsResult?.count || 0;

    return NextResponse.json({
      totalVideos,
      videosWatched,
      totalQuestions,
      questionsSolved,
      correctAnswers,
      accuracy,
      pendingDoubts,
    });
  } catch (error) {
    console.error("[STATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
