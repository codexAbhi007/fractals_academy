import { NextResponse } from "next/server";
import { db } from "@/db";
import { video } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classLevel = searchParams.get("class");
    const subject = searchParams.get("subject");

    // Build filter conditions (no enums, all text)
    let whereClause = undefined;
    if (classLevel && subject) {
      whereClause = and(
        eq(video.classLevel, classLevel),
        eq(video.subject, subject),
      );
    } else if (classLevel) {
      whereClause = eq(video.classLevel, classLevel);
    } else if (subject) {
      whereClause = eq(video.subject, subject);
    }

    const videos = await db
      .select()
      .from(video)
      .where(whereClause)
      .orderBy(desc(video.createdAt));

    return NextResponse.json(videos);
  } catch (error) {
    console.error("[VIDEOS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
