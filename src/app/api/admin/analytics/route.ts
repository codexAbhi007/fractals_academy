import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  user,
  video,
  question,
  questionAttempt,
  videoProgress,
  doubt,
} from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { count, eq, gte, and, sql } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();

    // Get current date info for calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total counts
    const [totalStudentsResult] = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.role, "STUDENT"));

    const [totalVideosResult] = await db.select({ count: count() }).from(video);

    const [totalQuestionsResult] = await db
      .select({ count: count() })
      .from(question);

    const [totalAttemptsResult] = await db
      .select({ count: count() })
      .from(questionAttempt);

    const [correctAttemptsResult] = await db
      .select({ count: count() })
      .from(questionAttempt)
      .where(eq(questionAttempt.isCorrect, true));

    const [totalVideoWatchesResult] = await db
      .select({ count: count() })
      .from(videoProgress)
      .where(eq(videoProgress.completed, true));

    const [pendingDoubtsResult] = await db
      .select({ count: count() })
      .from(doubt)
      .where(eq(doubt.status, "PENDING"));

    const [resolvedDoubtsResult] = await db
      .select({ count: count() })
      .from(doubt)
      .where(eq(doubt.status, "RESOLVED"));

    // Recent activity (last 7 days)
    const [recentStudentsResult] = await db
      .select({ count: count() })
      .from(user)
      .where(and(eq(user.role, "STUDENT"), gte(user.createdAt, sevenDaysAgo)));

    const [recentAttemptsResult] = await db
      .select({ count: count() })
      .from(questionAttempt)
      .where(gte(questionAttempt.attemptedAt, sevenDaysAgo));

    const [recentWatchesResult] = await db
      .select({ count: count() })
      .from(videoProgress)
      .where(
        and(
          eq(videoProgress.completed, true),
          gte(videoProgress.lastWatchedAt, sevenDaysAgo),
        ),
      );

    // Subject-wise question distribution
    const questionsBySubject = await db
      .select({
        subject: question.subject,
        count: count(),
      })
      .from(question)
      .groupBy(question.subject);

    // Class-wise video distribution
    const videosByClass = await db
      .select({
        classLevel: video.classLevel,
        count: count(),
      })
      .from(video)
      .groupBy(video.classLevel);

    // Top performers (by correct answers)
    const topPerformers = await db
      .select({
        userId: questionAttempt.userId,
        userName: user.name,
        userEmail: user.email,
        correctCount: count(),
      })
      .from(questionAttempt)
      .innerJoin(user, eq(questionAttempt.userId, user.id))
      .where(eq(questionAttempt.isCorrect, true))
      .groupBy(questionAttempt.userId, user.name, user.email)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    // Calculate overall accuracy
    const totalAttempts = totalAttemptsResult?.count || 0;
    const correctAttempts = correctAttemptsResult?.count || 0;
    const overallAccuracy =
      totalAttempts > 0
        ? Math.round((correctAttempts / totalAttempts) * 100)
        : 0;

    return NextResponse.json({
      overview: {
        totalStudents: totalStudentsResult?.count || 0,
        totalVideos: totalVideosResult?.count || 0,
        totalQuestions: totalQuestionsResult?.count || 0,
        totalAttempts,
        correctAttempts,
        overallAccuracy,
        totalVideoWatches: totalVideoWatchesResult?.count || 0,
        pendingDoubts: pendingDoubtsResult?.count || 0,
        resolvedDoubts: resolvedDoubtsResult?.count || 0,
      },
      recentActivity: {
        newStudents: recentStudentsResult?.count || 0,
        questionAttempts: recentAttemptsResult?.count || 0,
        videosWatched: recentWatchesResult?.count || 0,
      },
      distribution: {
        questionsBySubject,
        videosByClass,
      },
      topPerformers,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
