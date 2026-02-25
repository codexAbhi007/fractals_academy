import { NextResponse } from "next/server";
import { db } from "@/db";
import { platformConfig, chapter } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch all categories (public)
export async function GET() {
  try {
    // Get classes config
    const [classesConfig] = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.key, "classes"));
    const classes = classesConfig?.value || [];

    // Get subjects config
    const [subjectsConfig] = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.key, "subjects"));
    const subjects = subjectsConfig?.value || [];

    // Get chapters from database
    const chaptersFromDb = await db.select().from(chapter);

    // Build chapters object
    const chaptersObj: Record<string, string[]> = {};
    for (const subj of subjects) {
      const subjChapters = chaptersFromDb
        .filter((c) => c.subject === subj)
        .map((c) => c.name);
      chaptersObj[subj] = subjChapters;
    }

    return NextResponse.json({
      classes,
      subjects,
      chapters: chaptersObj,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
