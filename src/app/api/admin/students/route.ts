import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, questionAttempt, videoProgress } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { desc, eq, count, sql } from "drizzle-orm";

// GET - List all students with their stats
export async function GET() {
  try {
    await requireAdmin();

    // Get all students
    const students = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        preferredClassLevel: user.preferredClassLevel,
        preferredBatch: user.preferredBatch,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.role, "STUDENT"))
      .orderBy(desc(user.createdAt));

    // Get stats for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        // Get question attempt stats
        const [attemptStats] = await db
          .select({
            totalAttempts: count(),
            correctAttempts: sql<number>`sum(case when ${questionAttempt.isCorrect} then 1 else 0 end)::int`,
          })
          .from(questionAttempt)
          .where(eq(questionAttempt.userId, student.id));

        // Get video watch stats
        const [videoStats] = await db
          .select({
            videosWatched: count(),
          })
          .from(videoProgress)
          .where(eq(videoProgress.userId, student.id));

        const totalAttempts = attemptStats?.totalAttempts || 0;
        const correctAttempts = attemptStats?.correctAttempts || 0;
        const accuracy =
          totalAttempts > 0
            ? Math.round((correctAttempts / totalAttempts) * 100)
            : 0;

        return {
          ...student,
          stats: {
            totalAttempts,
            correctAttempts,
            accuracy,
            videosWatched: videoStats?.videosWatched || 0,
          },
        };
      }),
    );

    return NextResponse.json({ students: studentsWithStats });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}
