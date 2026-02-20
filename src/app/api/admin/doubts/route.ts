import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { doubt, user } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { desc, eq } from "drizzle-orm";

// GET - List all doubts for admin
export async function GET() {
  try {
    await requireAdmin();

    const doubts = await db
      .select({
        id: doubt.id,
        title: doubt.title,
        description: doubt.description,
        status: doubt.status,
        response: doubt.response,
        respondedAt: doubt.respondedAt,
        createdAt: doubt.createdAt,
        userId: doubt.userId,
        userName: user.name,
        userEmail: user.email,
      })
      .from(doubt)
      .leftJoin(user, eq(doubt.userId, user.id))
      .orderBy(desc(doubt.createdAt));

    return NextResponse.json({ doubts });
  } catch (error) {
    console.error("Error fetching doubts:", error);
    return NextResponse.json(
      { error: "Failed to fetch doubts" },
      { status: 500 },
    );
  }
}
