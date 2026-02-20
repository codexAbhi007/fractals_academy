import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { doubt } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";

// PUT - Respond to a doubt
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const { response, status } = body;

    if (!response || !response.trim()) {
      return NextResponse.json(
        { error: "Response is required" },
        { status: 400 },
      );
    }

    // Update the doubt with response
    const [updatedDoubt] = await db
      .update(doubt)
      .set({
        response: response.trim(),
        status: status || "RESOLVED",
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(doubt.id, id))
      .returning();

    if (!updatedDoubt) {
      return NextResponse.json({ error: "Doubt not found" }, { status: 404 });
    }

    return NextResponse.json(updatedDoubt);
  } catch (error) {
    console.error("Error responding to doubt:", error);
    return NextResponse.json(
      { error: "Failed to respond to doubt" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a doubt
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const [deletedDoubt] = await db
      .delete(doubt)
      .where(eq(doubt.id, id))
      .returning();

    if (!deletedDoubt) {
      return NextResponse.json({ error: "Doubt not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting doubt:", error);
    return NextResponse.json(
      { error: "Failed to delete doubt" },
      { status: 500 },
    );
  }
}
