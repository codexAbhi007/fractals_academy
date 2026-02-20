import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { platformConfig, chapter } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// Default values
const DEFAULT_CLASSES = ["7", "8", "9", "10", "11", "12", "JEE", "WBJEE"];
const DEFAULT_SUBJECTS = ["MATHEMATICS", "PHYSICS", "CHEMISTRY", "SCIENCE"];
const DEFAULT_CHAPTERS: Record<string, string[]> = {
  MATHEMATICS: [
    "Algebra",
    "Trigonometry",
    "Coordinate Geometry",
    "Calculus",
    "Vectors & 3D Geometry",
    "Probability & Statistics",
    "Sets & Relations",
    "Complex Numbers",
    "Matrices & Determinants",
    "Sequences & Series",
    "Permutations & Combinations",
    "Limits & Continuity",
    "Differential Equations",
    "Integral Calculus",
  ],
  PHYSICS: [
    "Mechanics",
    "Kinematics",
    "Laws of Motion",
    "Work, Energy & Power",
    "Rotational Motion",
    "Gravitation",
    "Thermodynamics",
    "Waves & Oscillations",
    "Optics",
    "Electrostatics",
    "Current Electricity",
    "Magnetism",
    "Electromagnetic Induction",
    "Modern Physics",
    "Semiconductors",
  ],
  CHEMISTRY: [
    "Atomic Structure",
    "Chemical Bonding",
    "States of Matter",
    "Thermodynamics",
    "Equilibrium",
    "Redox Reactions",
    "Electrochemistry",
    "Chemical Kinetics",
    "Organic Chemistry Basics",
    "Hydrocarbons",
    "Polymers",
    "Biomolecules",
    "Coordination Compounds",
    "Periodic Table",
  ],
  SCIENCE: [
    "Motion",
    "Force & Laws of Motion",
    "Gravitation",
    "Work & Energy",
    "Sound",
    "Light",
    "Electricity",
    "Magnetism",
    "Chemical Reactions",
    "Acids, Bases & Salts",
    "Metals & Non-metals",
    "Carbon Compounds",
    "Life Processes",
    "Heredity & Evolution",
  ],
};

// Helper to get or initialize config
async function getConfig(key: string, defaultValue: string[]) {
  const [config] = await db
    .select()
    .from(platformConfig)
    .where(eq(platformConfig.key, key));

  if (!config) {
    // Initialize with defaults
    await db.insert(platformConfig).values({
      id: nanoid(),
      key,
      value: defaultValue,
      updatedAt: new Date(),
    });
    return defaultValue;
  }

  return config.value;
}

// GET - Fetch all categories
export async function GET() {
  try {
    // Get classes and subjects from config (or defaults)
    const classes = await getConfig("classes", DEFAULT_CLASSES);
    const subjects = await getConfig("subjects", DEFAULT_SUBJECTS);

    // Get chapters from database
    const chaptersFromDb = await db.select().from(chapter);

    // Build chapters object
    const chaptersObj: Record<string, string[]> = {};
    for (const subj of subjects) {
      const subjChapters = chaptersFromDb
        .filter((c) => c.subject === subj)
        .map((c) => c.name);
      chaptersObj[subj] =
        subjChapters.length > 0 ? subjChapters : DEFAULT_CHAPTERS[subj] || [];
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
