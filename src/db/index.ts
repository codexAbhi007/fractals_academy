import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create a Neon SQL connection
const sql = neon(process.env.DATABASE_URL!);

// Create the Drizzle database instance
export const db = drizzle(sql, { schema });

export type Database = typeof db;
