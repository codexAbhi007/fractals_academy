import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { question } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// GET - List all questions
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    // Note: Filtering can be added later if needed
    const _searchParams = request.nextUrl.searchParams;

    const questions = await db
      .select()
      .from(question)
      .orderBy(desc(question.createdAt));

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}

// POST - Create new question
export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await request.json();
    const {
      classLevel,
      subject,
      chapter,
      topic,
      questionText,
      options,
      correctAnswer,
      difficulty,
      explanation,
      questionImage,
    } = body;

    // Validate required fields
    if (
      !classLevel ||
      !subject ||
      !chapter ||
      !topic ||
      !questionText ||
      !options ||
      options.length < 2 ||
      correctAnswer === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate correctAnswer is within range
    if (correctAnswer < 0 || correctAnswer >= options.length) {
      return NextResponse.json(
        { error: "Invalid correct answer index" },
        { status: 400 },
      );
    }

    // Create question record
    const newQuestion = await db
      .insert(question)
      .values({
        id: nanoid(),
        classLevel,
        subject,
        chapter,
        topic,
        questionText,
        options,
        correctAnswer,
        difficulty: difficulty || "MEDIUM",
        explanation: explanation || null,
        questionImage: questionImage || null,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json({ question: newQuestion[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 },
    );
  }
}
