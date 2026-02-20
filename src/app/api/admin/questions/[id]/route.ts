import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { question } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";

// GET - Get single question
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [foundQuestion] = await db
      .select()
      .from(question)
      .where(eq(question.id, id));

    if (!foundQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ question: foundQuestion });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 },
    );
  }
}

// PUT - Update question
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
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
    } = body;

    const [updatedQuestion] = await db
      .update(question)
      .set({
        classLevel,
        subject,
        chapter,
        topic,
        questionText,
        options,
        correctAnswer,
        difficulty,
        explanation,
        updatedAt: new Date(),
      })
      .where(eq(question.id, id))
      .returning();

    if (!updatedQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ question: updatedQuestion });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 },
    );
  }
}

// DELETE - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [deletedQuestion] = await db
      .delete(question)
      .where(eq(question.id, id))
      .returning();

    if (!deletedQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 },
    );
  }
}
