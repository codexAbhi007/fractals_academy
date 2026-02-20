import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  json,
  real,
} from "drizzle-orm/pg-core";

// ==================== ENUMS ====================
export const userRoleEnum = pgEnum("user_role", ["STUDENT", "ADMIN"]);
export const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);
export const classEnum = pgEnum("class_level", [
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "JEE",
  "WBJEE",
]);
export const subjectEnum = pgEnum("subject", [
  "MATHEMATICS",
  "PHYSICS",
  "CHEMISTRY",
  "SCIENCE",
]);

// ==================== BETTER AUTH TABLES ====================
// These tables follow Better Auth's schema requirements

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("STUDENT"),
  // Student preferences for personalized content
  preferredClassLevel: classEnum("preferred_class_level"),
  preferredBatch: text("preferred_batch"), // JEE, WBJEE, BOARDS, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==================== APPLICATION TABLES ====================

// YouTube Videos
export const video = pgTable("video", {
  id: text("id").primaryKey(),
  youtubeUrl: text("youtube_url").notNull(),
  youtubeId: text("youtube_id").notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  description: text("description"),
  classLevel: classEnum("class_level").notNull(),
  subject: subjectEnum("subject").notNull(),
  chapter: text("chapter"),
  topic: text("topic"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
});

// Question Bank
export const question = pgTable("question", {
  id: text("id").primaryKey(),
  classLevel: classEnum("class_level").notNull(),
  subject: subjectEnum("subject").notNull(),
  chapter: text("chapter").notNull(),
  topic: text("topic").notNull(),
  questionText: text("question_text").notNull(), // LaTeX supported
  questionImage: text("question_image"), // Optional image URL for the question
  options: json("options").$type<string[]>().notNull(), // Array of options (LaTeX supported)
  correctAnswer: integer("correct_answer").notNull(), // Index of correct option (0-based)
  difficulty: difficultyEnum("difficulty").notNull().default("MEDIUM"),
  explanation: text("explanation"), // LaTeX supported explanation
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
});

// Student Question Attempts
export const questionAttempt = pgTable("question_attempt", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeTaken: integer("time_taken"), // in seconds
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

// Video Watch Progress
export const videoProgress = pgTable("video_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  videoId: text("video_id")
    .notNull()
    .references(() => video.id, { onDelete: "cascade" }),
  watchedDuration: integer("watched_duration").notNull().default(0), // in seconds
  completed: boolean("completed").notNull().default(false),
  lastWatchedAt: timestamp("last_watched_at").notNull().defaultNow(),
});

// Doubt Resolution
export const doubt = pgTable("doubt", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  questionId: text("question_id").references(() => question.id), // Optional - linked to a question
  videoId: text("video_id").references(() => video.id), // Optional - linked to a video
  title: text("title").notNull(),
  description: text("description").notNull(), // LaTeX supported
  status: text("status").notNull().default("PENDING"), // PENDING, RESOLVED
  response: text("response"), // Admin's response (LaTeX supported)
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Monthly Reports (for tracking sent reports)
export const monthlyReport = pgTable("monthly_report", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  videosWatched: integer("videos_watched").notNull().default(0),
  questionsSolved: integer("questions_solved").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  accuracyPercentage: real("accuracy_percentage").notNull().default(0),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
});

// Platform Configuration (for dynamic categories)
export const platformConfig = pgTable("platform_config", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., "classes", "subjects", "chapters"
  value: json("value").$type<string[]>().notNull(), // Array of values
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Dynamic Chapters (linked to subjects)
export const chapter = pgTable("chapter", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(), // Link to subject
  classLevel: text("class_level"), // Optional: specific to class
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==================== TYPE EXPORTS ====================
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Video = typeof video.$inferSelect;
export type NewVideo = typeof video.$inferInsert;
export type Question = typeof question.$inferSelect;
export type NewQuestion = typeof question.$inferInsert;
export type QuestionAttempt = typeof questionAttempt.$inferSelect;
export type Doubt = typeof doubt.$inferSelect;
