import { db } from "@/db";
import { user, video, question, questionAttempt } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, BookOpen, Users, Target } from "lucide-react";

async function getStats() {
  const [totalStudents] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "STUDENT"));

  const [totalVideos] = await db.select({ count: count() }).from(video);
  const [totalQuestions] = await db.select({ count: count() }).from(question);
  const [totalAttempts] = await db
    .select({ count: count() })
    .from(questionAttempt);

  return {
    students: totalStudents?.count || 0,
    videos: totalVideos?.count || 0,
    questions: totalQuestions?.count || 0,
    attempts: totalAttempts?.count || 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.students}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Video Lectures
            </CardTitle>
            <Video className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.videos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Uploaded videos
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Question Bank
            </CardTitle>
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.questions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Practice problems
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Attempts
            </CardTitle>
            <Target className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.attempts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Questions answered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/videos/new"
            className="flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          >
            <Video className="h-8 w-8 text-purple-400" />
            <div>
              <p className="font-medium">Add Video</p>
              <p className="text-sm text-muted-foreground">
                Upload a new YouTube lecture
              </p>
            </div>
          </a>
          <a
            href="/admin/questions/new"
            className="flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          >
            <BookOpen className="h-8 w-8 text-pink-400" />
            <div>
              <p className="font-medium">Add Question</p>
              <p className="text-sm text-muted-foreground">
                Create a practice problem
              </p>
            </div>
          </a>
          <a
            href="/admin/students"
            className="flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          >
            <Users className="h-8 w-8 text-cyan-400" />
            <div>
              <p className="font-medium">Manage Students</p>
              <p className="text-sm text-muted-foreground">
                View and manage users
              </p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
