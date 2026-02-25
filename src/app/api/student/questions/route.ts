import { NextResponse } from "next/server";
import { db } from "@/db";
import { platformConfig, question } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classLevel = searchParams.get("class");
    const subject = searchParams.get("subject");
    const chapter = searchParams.get("chapter");
    const difficulty = searchParams.get("difficulty");
    const limit = searchParams.get("limit");

    // Build conditions array
    const conditions = [];

    // Fetch dynamic class levels and subjects from platformConfig
    const [classesConfig] = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.key, "classes"));
    const dynamicClassLevels: string[] = classesConfig?.value || [];

    const [subjectsConfig] = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.key, "subjects"));
    const dynamicSubjects: string[] = subjectsConfig?.value || [];

    if (classLevel && dynamicClassLevels.includes(classLevel)) {
      conditions.push(eq(question.classLevel, classLevel));
    }
    if (subject && dynamicSubjects.includes(subject)) {
      conditions.push(eq(question.subject, subject));
    }
    if (chapter) {
      conditions.push(eq(question.chapter, chapter));
    }
    if (difficulty) {
      conditions.push(
        eq(question.difficulty, difficulty as "EASY" | "MEDIUM" | "HARD"),
      );
    }

    let query;
    if (conditions.length > 0) {
      query = db
        .select()
        .from(question)
        .where(and(...conditions))
        .orderBy(desc(question.createdAt));
    } else {
      query = db.select().from(question).orderBy(desc(question.createdAt));
    }

    const questions = limit ? await query.limit(parseInt(limit)) : await query;

    return NextResponse.json(questions);
  } catch (error) {
    console.error("[QUESTIONS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}
