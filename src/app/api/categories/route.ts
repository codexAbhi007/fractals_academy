import { NextResponse } from "next/server";
import { db } from "@/db";
import { platformConfig, chapter } from "@/db/schema";
import { eq } from "drizzle-orm";

// Default values (same as admin)
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

// GET - Fetch all categories (public)
export async function GET() {
  try {
    // Get classes config
    const [classesConfig] = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.key, "classes"));
    const classes = classesConfig?.value || DEFAULT_CLASSES;

    // Get subjects config
    const [subjectsConfig] = await db
      .select()
      .from(platformConfig)
      .where(eq(platformConfig.key, "subjects"));
    const subjects = subjectsConfig?.value || DEFAULT_SUBJECTS;

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
