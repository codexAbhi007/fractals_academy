"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Video,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  BarChart3,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalVideos: number;
    totalQuestions: number;
    totalAttempts: number;
    correctAttempts: number;
    overallAccuracy: number;
    totalVideoWatches: number;
    pendingDoubts: number;
    resolvedDoubts: number;
  };
  recentActivity: {
    newStudents: number;
    questionAttempts: number;
    videosWatched: number;
  };
  distribution: {
    questionsBySubject: { subject: string; count: number }[];
    videosByClass: { classLevel: string; count: number }[];
  };
  topPerformers: {
    userId: string;
    userName: string;
    userEmail: string;
    correctCount: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        Failed to load analytics data
      </div>
    );
  }

  const subjectColors: Record<string, string> = {
    MATHEMATICS: "bg-purple-500",
    PHYSICS: "bg-blue-500",
    CHEMISTRY: "bg-green-500",
    SCIENCE: "bg-cyan-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track platform performance and student engagement
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-400" />+
              {data.recentActivity.newStudents} this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Videos
            </CardTitle>
            <Video className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.totalVideos}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.overview.totalVideoWatches} total watches
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Questions
            </CardTitle>
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.totalQuestions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.overview.totalAttempts} attempts
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Accuracy
            </CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.overallAccuracy}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.overview.correctAttempts}/{data.overview.totalAttempts}{" "}
              correct
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Doubts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              Last 7 Days Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">New Students</span>
              <Badge
                variant="outline"
                className="border-purple-500/50 text-purple-400"
              >
                +{data.recentActivity.newStudents}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Question Attempts</span>
              <Badge
                variant="outline"
                className="border-pink-500/50 text-pink-400"
              >
                {data.recentActivity.questionAttempts}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Videos Watched</span>
              <Badge
                variant="outline"
                className="border-cyan-500/50 text-cyan-400"
              >
                {data.recentActivity.videosWatched}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Doubt Resolution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pending</span>
              <Badge
                variant="outline"
                className="border-yellow-500/50 text-yellow-400"
              >
                {data.overview.pendingDoubts}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Resolved</span>
              <Badge
                variant="outline"
                className="border-green-500/50 text-green-400"
              >
                {data.overview.resolvedDoubts}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Resolution Rate</span>
              <Badge
                variant="outline"
                className="border-blue-500/50 text-blue-400"
              >
                {data.overview.pendingDoubts + data.overview.resolvedDoubts > 0
                  ? Math.round(
                      (data.overview.resolvedDoubts /
                        (data.overview.pendingDoubts +
                          data.overview.resolvedDoubts)) *
                        100,
                    )
                  : 100}
                %
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Questions by Subject
            </CardTitle>
            <CardDescription>Distribution across subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.distribution.questionsBySubject.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No questions yet
              </p>
            ) : (
              data.distribution.questionsBySubject.map((item) => {
                const total = data.distribution.questionsBySubject.reduce(
                  (sum, q) => sum + q.count,
                  0,
                );
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">
                        {item.subject.toLowerCase()}
                      </span>
                      <span className="text-muted-foreground">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${subjectColors[item.subject] || "bg-purple-500"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5 text-pink-400" />
              Videos by Class
            </CardTitle>
            <CardDescription>Distribution across class levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.distribution.videosByClass.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No videos yet
              </p>
            ) : (
              data.distribution.videosByClass.map((item) => {
                const total = data.distribution.videosByClass.reduce(
                  (sum, v) => sum + v.count,
                  0,
                );
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={item.classLevel} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {["JEE", "WBJEE"].includes(item.classLevel)
                          ? item.classLevel
                          : `Class ${item.classLevel}`}
                      </span>
                      <span className="text-muted-foreground">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Top Performers
          </CardTitle>
          <CardDescription>Students with most correct answers</CardDescription>
        </CardHeader>
        <CardContent>
          {data.topPerformers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No attempts yet
            </p>
          ) : (
            <div className="space-y-3">
              {data.topPerformers.map((performer, idx) => (
                <div
                  key={performer.userId}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                      {getInitials(performer.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {performer.userName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {performer.userEmail}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-500/50 text-green-400 shrink-0"
                  >
                    {performer.correctCount} correct
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
