import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { platformConfig, chapter } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";

import { nanoid } from "nanoid";

// Helper to get or initialize config
async function getConfig(key: string, defaultValue: string[]) {
  const [config] = await db
    .select()
    .from(platformConfig)
    .where(eq(platformConfig.key, key));

  if (!config) {
    // Initialize with empty array if missing
    await db.insert(platformConfig).values({
      id: nanoid(),
      key,
      value: [],
      updatedAt: new Date(),
    });
    return [];
  }
  return config.value;
}

// GET - Fetch all categories
export async function GET() {
  try {
    // Get classes and subjects from config (no defaults)
    const classes = await getConfig("classes", []);
    const subjects = await getConfig("subjects", []);

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

// PUT - Update categories (admin only)
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { type, values, subject } = body;

    if (type === "classes") {
      // Update classes config
      const [existing] = await db
        .select()
        .from(platformConfig)
        .where(eq(platformConfig.key, "classes"));

      if (existing) {
        await db
          .update(platformConfig)
          .set({ value: values, updatedAt: new Date() })
          .where(eq(platformConfig.key, "classes"));
      } else {
        await db.insert(platformConfig).values({
          id: nanoid(),
          key: "classes",
          value: values,
          updatedAt: new Date(),
        });
      }
    } else if (type === "subjects") {
      // Update subjects config
      const [existing] = await db
        .select()
        .from(platformConfig)
        .where(eq(platformConfig.key, "subjects"));

      if (existing) {
        await db
          .update(platformConfig)
          .set({ value: values, updatedAt: new Date() })
          .where(eq(platformConfig.key, "subjects"));
      } else {
        await db.insert(platformConfig).values({
          id: nanoid(),
          key: "subjects",
          value: values,
          updatedAt: new Date(),
        });
      }
    } else if (type === "chapters" && subject) {
      // Delete existing chapters for this subject
      await db.delete(chapter).where(eq(chapter.subject, subject));

      // Insert new chapters
      if (values && values.length > 0) {
        await db.insert(chapter).values(
          values.map((name: string) => ({
            id: nanoid(),
            name,
            subject,
            createdAt: new Date(),
          })),
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating categories:", error);
    return NextResponse.json(
      { error: "Failed to update categories" },
      { status: 500 },
    );
  }
}
