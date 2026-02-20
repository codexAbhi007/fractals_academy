import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questionAttempt, question } from "@/db/schema";
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
    const { questionId, selectedAnswer, timeTaken } = body;

    if (!questionId || selectedAnswer === undefined) {
      return NextResponse.json(
        { error: "questionId and selectedAnswer are required" },
        { status: 400 },
      );
    }

    // Get the question to check correctness
    const [questionData] = await db
      .select()
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if (!questionData) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    const isCorrect = selectedAnswer === questionData.correctAnswer;

    // Create the attempt
    const [attempt] = await db
      .insert(questionAttempt)
      .values({
        id: nanoid(),
        userId: user.id,
        questionId,
        selectedAnswer,
        isCorrect,
        timeTaken: timeTaken || null,
      })
      .returning();

    return NextResponse.json({
      attempt,
      isCorrect,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
    });
  } catch (error) {
    console.error("[ATTEMPT_POST]", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
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
    const questionId = searchParams.get("questionId");

    // Get attempts for the user
    let attempts;
    if (questionId) {
      attempts = await db
        .select()
        .from(questionAttempt)
        .where(
          and(
            eq(questionAttempt.userId, user.id),
            eq(questionAttempt.questionId, questionId),
          ),
        );
    } else {
      attempts = await db
        .select()
        .from(questionAttempt)
        .where(eq(questionAttempt.userId, user.id));
    }

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("[ATTEMPTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch attempts" },
      { status: 500 },
    );
  }
}
