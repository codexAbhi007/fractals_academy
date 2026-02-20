import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch current user's profile including preferences
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userData] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        preferredClassLevel: user.preferredClassLevel,
        preferredBatch: user.preferredBatch,
      })
      .from(user)
      .where(eq(user.id, session.user.id));

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

// PUT - Update user's profile preferences
export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, preferredClassLevel, preferredBatch } = body;

    // Build the update object
    const updateData: {
      name?: string;
      preferredClassLevel?:
        | "7"
        | "8"
        | "9"
        | "10"
        | "11"
        | "12"
        | "JEE"
        | "WBJEE"
        | null;
      preferredBatch?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name;
    }

    if (preferredClassLevel !== undefined) {
      // Validate class level
      const validClassLevels = [
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "JEE",
        "WBJEE",
        null,
      ];
      if (!validClassLevels.includes(preferredClassLevel)) {
        return NextResponse.json(
          { error: "Invalid class level" },
          { status: 400 },
        );
      }
      updateData.preferredClassLevel = preferredClassLevel;
    }

    if (preferredBatch !== undefined) {
      // Validate batch
      const validBatches = ["JEE", "WBJEE", "BOARDS", null];
      if (!validBatches.includes(preferredBatch)) {
        return NextResponse.json({ error: "Invalid batch" }, { status: 400 });
      }
      updateData.preferredBatch = preferredBatch;
    }

    const [updatedUser] = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, session.user.id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        preferredClassLevel: user.preferredClassLevel,
        preferredBatch: user.preferredBatch,
      });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
