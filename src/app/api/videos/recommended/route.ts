import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { video, user, platformConfig } from "@/db/schema";
import { eq, desc, or, sql } from "drizzle-orm";

// GET - Fetch recommended videos for home page
// If user is logged in and has preferences, filter by their class level
// Otherwise, return latest videos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 6;

    // Try to get user session for personalized recommendations
    let preferredClassLevel: string | null = null;
    let preferredBatch: string | null = null;

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (session?.user) {
        // Fetch user preferences
        const [userData] = await db
          .select({
            preferredClassLevel: user.preferredClassLevel,
            preferredBatch: user.preferredBatch,
          })
          .from(user)
          .where(eq(user.id, session.user.id));

        if (userData) {
          preferredClassLevel = userData.preferredClassLevel;
          preferredBatch = userData.preferredBatch;
        }
      }
    } catch {
      // User not logged in, continue with default recommendations
    }

    // Build query based on preferences
    let videosQuery;

    // Fetch dynamic class levels from platformConfig
    const [classesConfig] = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.key, "classes"));
    const dynamicClassLevels: string[] = classesConfig?.value || [];

    if (preferredClassLevel || preferredBatch) {
      // User has preferences - get matching videos first, then fill with others
      const conditions = [];

      if (
        preferredClassLevel &&
        dynamicClassLevels.includes(preferredClassLevel)
      ) {
        conditions.push(eq(video.classLevel, preferredClassLevel));
      }

      // For batch preferences, match videos with those class levels if present in dynamic config
      if (preferredBatch && dynamicClassLevels.includes(preferredBatch)) {
        conditions.push(eq(video.classLevel, preferredBatch));
      }

      if (conditions.length > 0) {
        // Get matching videos with priority scoring
        videosQuery = await db
          .select({
            id: video.id,
            title: video.title,
            youtubeId: video.youtubeId,
            thumbnail: video.thumbnail,
            description: video.description,
            classLevel: video.classLevel,
            subject: video.subject,
            chapter: video.chapter,
            topic: video.topic,
            createdAt: video.createdAt,
          })
          .from(video)
          .where(or(...conditions))
          .orderBy(desc(video.createdAt))
          .limit(limit);

        // If we don't have enough matching videos, fill with latest
        if (videosQuery.length < limit) {
          const existingIds = videosQuery.map((v) => v.id);
          const additionalVideos = await db
            .select({
              id: video.id,
              title: video.title,
              youtubeId: video.youtubeId,
              thumbnail: video.thumbnail,
              description: video.description,
              classLevel: video.classLevel,
              subject: video.subject,
              chapter: video.chapter,
              topic: video.topic,
              createdAt: video.createdAt,
            })
            .from(video)
            .where(
              sql`${video.id} NOT IN (${existingIds.length > 0 ? existingIds.map((id) => `'${id}'`).join(",") : "''"})`,
            )
            .orderBy(desc(video.createdAt))
            .limit(limit - videosQuery.length);

          videosQuery = [...videosQuery, ...additionalVideos];
        }
      } else {
        // No valid conditions, get latest videos
        videosQuery = await db
          .select({
            id: video.id,
            title: video.title,
            youtubeId: video.youtubeId,
            thumbnail: video.thumbnail,
            description: video.description,
            classLevel: video.classLevel,
            subject: video.subject,
            chapter: video.chapter,
            topic: video.topic,
            createdAt: video.createdAt,
          })
          .from(video)
          .orderBy(desc(video.createdAt))
          .limit(limit);
      }
    } else {
      // No preferences - return latest videos
      videosQuery = await db
        .select({
          id: video.id,
          title: video.title,
          youtubeId: video.youtubeId,
          thumbnail: video.thumbnail,
          description: video.description,
          classLevel: video.classLevel,
          subject: video.subject,
          chapter: video.chapter,
          topic: video.topic,
          createdAt: video.createdAt,
        })
        .from(video)
        .orderBy(desc(video.createdAt))
        .limit(limit);
    }

    // Deduplicate videos by ID before returning
    const uniqueVideos = Array.from(
      new Map(videosQuery.map((v) => [v.id, v])).values(),
    );
    return NextResponse.json(uniqueVideos);
  } catch (error) {
    console.error("Error fetching recommended videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
