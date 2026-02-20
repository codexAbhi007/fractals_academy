import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { video } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Helper function to extract YouTube ID from URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// Fetch YouTube video data using oEmbed (no API key required)
async function fetchYouTubeData(youtubeId: string) {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch video data");
    }

    const data = await response.json();
    return {
      title: data.title || "Untitled Video",
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    };
  } catch {
    // Fallback if oEmbed fails
    return {
      title: "YouTube Video",
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    };
  }
}

// GET - List all videos
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    // Note: Filtering can be added later if needed
    const _searchParams = request.nextUrl.searchParams;

    const videos = await db.select().from(video).orderBy(desc(video.createdAt));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}

// POST - Create new video
export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await request.json();
    const { youtubeUrl, classLevel, subject, chapter, topic, description } =
      body;

    // Validate required fields
    if (!youtubeUrl || !classLevel || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Extract YouTube ID
    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    // Fetch video metadata
    const videoData = await fetchYouTubeData(youtubeId);

    // Create video record
    const newVideo = await db
      .insert(video)
      .values({
        id: nanoid(),
        youtubeUrl,
        youtubeId,
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        description: description || null,
        classLevel,
        subject,
        chapter: chapter || null,
        topic: topic || null,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json({ video: newVideo[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 },
    );
  }
}
