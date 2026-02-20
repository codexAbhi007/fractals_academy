import { NextResponse } from "next/server";
import { db } from "@/db";
import { video } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classLevel = searchParams.get("class");
    const subject = searchParams.get("subject");

    let query = db.select().from(video);

    // Build filter conditions
    const conditions = [];
    if (classLevel) {
      conditions.push(
        eq(
          video.classLevel,
          classLevel as "7" | "8" | "9" | "10" | "11" | "12" | "JEE" | "WBJEE",
        ),
      );
    }
    if (subject) {
      conditions.push(
        eq(
          video.subject,
          subject as "MATHEMATICS" | "PHYSICS" | "CHEMISTRY" | "SCIENCE",
        ),
      );
    }

    const videos =
      conditions.length > 0
        ? await query.where(conditions[0]).orderBy(desc(video.createdAt))
        : await query.orderBy(desc(video.createdAt));

    // If we have two conditions, we need to use both (AND logic)
    // For simplicity, let's refetch with proper filtering
    if (classLevel && subject) {
      const filtered = await db
        .select()
        .from(video)
        .where(
          eq(
            video.classLevel,
            classLevel as
              | "7"
              | "8"
              | "9"
              | "10"
              | "11"
              | "12"
              | "JEE"
              | "WBJEE",
          ),
        )
        .orderBy(desc(video.createdAt));

      const result = filtered.filter((v) => v.subject === subject);
      return NextResponse.json(result);
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error("[VIDEOS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
