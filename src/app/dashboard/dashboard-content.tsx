"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Video,
  BookOpen,
  HelpCircle,
  ChartLine,
  Filter,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Loader2,
  ChevronRight,
  Check,
  Save,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LatexRenderer } from "@/components/ui/latex-renderer";
import { StudentSidebar } from "@/components/student/student-sidebar";

interface DashboardContentProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  } | null;
}

interface ProfileType {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  preferredClassLevel?: string | null;
  preferredBatch?: string | null;
}

const batches = ["JEE", "WBJEE", "BOARDS"];

interface VideoType {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  description?: string;
  classLevel: string;
  subject: string;
  chapter?: string;
  topic?: string;
}

interface QuestionType {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  classLevel: string;
  subject: string;
  chapter: string;
  topic: string;
  explanation?: string;
}

interface DoubtType {
  id: string;
  title: string;
  description: string;
  status: string;
  response?: string;
  createdAt: string;
}

interface StatsType {
  totalVideos: number;
  videosWatched: number;
  totalQuestions: number;
  questionsSolved: number;
  correctAnswers: number;
  accuracy: number;
  pendingDoubts: number;
}

interface VideoProgressType {
  videoId: string;
  completed: boolean;
}

interface CategoriesType {
  classes: string[];
  subjects: string[];
  chapters: Record<string, string[]>;
}

const defaultClasses = ["7", "8", "9", "10", "11", "12", "JEE", "WBJEE"];
const defaultSubjects = ["PHYSICS", "CHEMISTRY", "MATHEMATICS", "SCIENCE"];
const difficulties = ["EASY", "MEDIUM", "HARD"];

// Button base styles for interactive animations
const btnInteractive =
  "cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-150";
const btnPrimary = `${btnInteractive} bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`;

export function DashboardContent({ user }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic categories
  const [categories, setCategories] = useState<CategoriesType | null>(null);
  const classLevels = categories?.classes || defaultClasses;
  const subjects = categories?.subjects || defaultSubjects;

  // Stats
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Videos
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoFilters, setVideoFilters] = useState({ class: "", subject: "" });
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [markingWatched, setMarkingWatched] = useState<string | null>(null);

  // Questions
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionFilters, setQuestionFilters] = useState({
    class: "",
    subject: "",
    difficulty: "",
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
    null,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Doubts
  const [doubts, setDoubts] = useState<DoubtType[]>([]);
  const [loadingDoubts, setLoadingDoubts] = useState(false);
  const [newDoubt, setNewDoubt] = useState({ title: "", description: "" });
  const [submittingDoubt, setSubmittingDoubt] = useState(false);

  // Profile / Settings
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    preferredClassLevel: "",
    preferredBatch: "",
  });

  useEffect(() => {
    fetchStats();
    fetchVideoProgress();
    fetchProfile();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      // Use defaults if fetch fails
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/student/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      console.error("Failed to fetch stats");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchVideoProgress = async () => {
    try {
      const res = await fetch("/api/student/video-progress");
      if (res.ok) {
        const data: VideoProgressType[] = await res.json();
        const watched = new Set(
          data.filter((p) => p.completed).map((p) => p.videoId),
        );
        setWatchedVideos(watched);
      }
    } catch {
      console.error("Failed to fetch video progress");
    }
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/student/profile");
      if (res.ok) {
        const data: ProfileType = await res.json();
        setProfile(data);
        setProfileForm({
          name: data.name || "",
          preferredClassLevel: data.preferredClassLevel || "",
          preferredBatch: data.preferredBatch || "",
        });
      }
    } catch {
      console.error("Failed to fetch profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name || undefined,
          preferredClassLevel: profileForm.preferredClassLevel || null,
          preferredBatch: profileForm.preferredBatch || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    if (activeTab === "videos") fetchVideos();
  }, [activeTab, videoFilters]);

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const params = new URLSearchParams();
      if (videoFilters.class) params.set("class", videoFilters.class);
      if (videoFilters.subject) params.set("subject", videoFilters.subject);
      const res = await fetch(`/api/student/videos?${params.toString()}`);
      if (res.ok) setVideos(await res.json());
    } catch {
      toast.error("Failed to load videos");
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (activeTab === "questions") fetchQuestions();
  }, [activeTab, questionFilters]);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const params = new URLSearchParams();
      if (questionFilters.class) params.set("class", questionFilters.class);
      if (questionFilters.subject)
        params.set("subject", questionFilters.subject);
      if (questionFilters.difficulty)
        params.set("difficulty", questionFilters.difficulty);
      const res = await fetch(`/api/student/questions?${params.toString()}`);
      if (res.ok) setQuestions(await res.json());
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (activeTab === "doubts") fetchDoubts();
  }, [activeTab]);

  const fetchDoubts = async () => {
    setLoadingDoubts(true);
    try {
      const res = await fetch("/api/student/doubts");
      if (res.ok) setDoubts(await res.json());
    } catch {
      toast.error("Failed to load doubts");
    } finally {
      setLoadingDoubts(false);
    }
  };

  // Mark video as watched
  const markVideoWatched = async (
    videoId: string,
    openVideo = false,
    youtubeId?: string,
  ) => {
    if (watchedVideos.has(videoId) && openVideo && youtubeId) {
      window.open(`https://youtube.com/watch?v=${youtubeId}`, "_blank");
      return;
    }

    setMarkingWatched(videoId);
    try {
      const res = await fetch("/api/student/video-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      if (res.ok) {
        setWatchedVideos((prev) => new Set([...prev, videoId]));
        fetchStats();
        if (openVideo && youtubeId) {
          window.open(`https://youtube.com/watch?v=${youtubeId}`, "_blank");
        } else {
          toast.success("Marked as watched!");
        }
      }
    } catch {
      toast.error("Failed to mark as watched");
    } finally {
      setMarkingWatched(null);
    }
  };

  const startQuestion = (q: QuestionType) => {
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null || !currentQuestion) return;
    setSubmittingAnswer(true);
    try {
      const res = await fetch("/api/student/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedAnswer,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsCorrect(data.isCorrect);
        setShowResult(true);
        fetchStats();
      } else {
        toast.error("Failed to submit answer");
      }
    } catch {
      toast.error("Failed to submit answer");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const submitDoubt = async () => {
    if (!newDoubt.title.trim() || !newDoubt.description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }
    setSubmittingDoubt(true);
    try {
      const res = await fetch("/api/student/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoubt),
      });
      if (res.ok) {
        toast.success("Doubt submitted!");
        setNewDoubt({ title: "", description: "" });
        fetchDoubts();
        fetchStats();
      } else {
        toast.error("Failed to submit doubt");
      }
    } catch {
      toast.error("Failed to submit doubt");
    } finally {
      setSubmittingDoubt(false);
    }
  };

  const difficultyColors: Record<string, string> = {
    EASY: "bg-green-500/20 text-green-400 border-green-500/50",
    MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    HARD: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  return (
    <div className="min-h-screen bg-background flex">
      <StudentSidebar
        user={{
          id: user?.id || "",
          name: user?.name || "",
          email: user?.email || "",
          image: user?.image,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 pl-16 md:pl-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s an overview of your learning progress.
            </p>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: "Videos Watched",
                    value: loadingStats
                      ? "..."
                      : `${stats?.videosWatched || 0}/${stats?.totalVideos || 0}`,
                    icon: Video,
                    color: "purple",
                  },
                  {
                    label: "Questions Solved",
                    value: loadingStats ? "..." : stats?.questionsSolved || 0,
                    icon: BookOpen,
                    color: "pink",
                  },
                  {
                    label: "Accuracy Rate",
                    value: loadingStats ? "..." : `${stats?.accuracy || 0}%`,
                    icon: ChartLine,
                    color: "cyan",
                  },
                  {
                    label: "Pending Doubts",
                    value: loadingStats ? "..." : stats?.pendingDoubts || 0,
                    icon: HelpCircle,
                    color: "orange",
                  },
                ].map((stat, idx) => (
                  <Card key={idx} className="border-white/10 bg-white/5">
                    <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <stat.icon
                        className={`h-3.5 w-3.5 text-${stat.color}-400`}
                      />
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="text-xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-white/10 bg-white/5">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                  <CardDescription className="text-xs">
                    Jump right back into learning
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3 p-3 pt-0">
                  <Button
                    variant="outline"
                    className={`h-auto py-3 flex flex-col gap-1.5 border-white/10 hover:bg-white/5 ${btnInteractive}`}
                    onClick={() => setActiveTab("videos")}
                  >
                    <Video className="h-5 w-5 text-purple-400" />
                    <span className="text-xs">Browse Videos</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`h-auto py-3 flex flex-col gap-1.5 border-white/10 hover:bg-white/5 ${btnInteractive}`}
                    onClick={() => setActiveTab("questions")}
                  >
                    <BookOpen className="h-5 w-5 text-pink-400" />
                    <span className="text-xs">Practice Questions</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`h-auto py-3 flex flex-col gap-1.5 border-white/10 hover:bg-white/5 ${btnInteractive}`}
                    onClick={() => setActiveTab("doubts")}
                  >
                    <HelpCircle className="h-5 w-5 text-cyan-400" />
                    <span className="text-xs">Ask a Doubt</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* VIDEOS TAB */}
          {activeTab === "videos" && (
            <div className="space-y-4">
              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-3 items-center">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={videoFilters.class}
                      onValueChange={(v) =>
                        setVideoFilters({
                          ...videoFilters,
                          class: v === "all" ? "" : v,
                        })
                      }
                    >
                      <SelectTrigger className="w-30 h-8 text-xs border-white/10 bg-white/5 cursor-pointer">
                        <SelectValue placeholder="All Classes" />
                      </SelectTrigger>
                      <SelectContent>
                        {["all", ...classLevels].map((c) => (
                          <SelectItem
                            key={c}
                            value={c}
                            className="cursor-pointer"
                          >
                            {c === "all" ? "All Classes" : `Class ${c}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={videoFilters.subject}
                      onValueChange={(v) =>
                        setVideoFilters({
                          ...videoFilters,
                          subject: v === "all" ? "" : v,
                        })
                      }
                    >
                      <SelectTrigger className="w-35 h-8 text-xs border-white/10 bg-white/5 cursor-pointer">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        {["all", ...subjects].map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="cursor-pointer"
                          >
                            {s === "all"
                              ? "All Subjects"
                              : s.charAt(0) + s.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {loadingVideos ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : videos.length === 0 ? (
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="py-8 text-center">
                    <Video className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No videos available yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {videos.map((v) => {
                    const isWatched = watchedVideos.has(v.id);
                    return (
                      <Card
                        key={v.id}
                        className={`border-white/10 bg-white/5 overflow-hidden hover:bg-white/[0.07] transition-all group ${isWatched ? "ring-1 ring-green-500/30" : ""}`}
                      >
                        <div
                          className="aspect-video relative cursor-pointer"
                          onClick={() =>
                            markVideoWatched(v.id, true, v.youtubeId)
                          }
                        >
                          <Image
                            src={v.thumbnail}
                            alt={v.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="h-10 w-10 text-white" />
                          </div>
                          {isWatched && (
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <div className="flex gap-1.5 mb-1.5 flex-wrap">
                            <Badge
                              variant="outline"
                              className="border-purple-500/50 text-purple-400 text-[10px] px-1.5 py-0"
                            >
                              Class {v.classLevel}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-pink-500/50 text-pink-400 text-[10px] px-1.5 py-0 capitalize"
                            >
                              {v.subject.toLowerCase()}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-sm line-clamp-2 mb-2">
                            {v.title}
                          </h3>
                          {!isWatched && (
                            <Button
                              size="sm"
                              variant="outline"
                              className={`w-full h-7 text-xs border-white/10 ${btnInteractive}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                markVideoWatched(v.id);
                              }}
                              disabled={markingWatched === v.id}
                            >
                              {markingWatched === v.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Mark as Watched
                                </>
                              )}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* QUESTIONS TAB */}
          {activeTab === "questions" && (
            <div className="space-y-4">
              {currentQuestion ? (
                <Card className="border-white/10 bg-white/5">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge
                          variant="outline"
                          className="border-purple-500/50 text-purple-400 text-[10px]"
                        >
                          Class {currentQuestion.classLevel}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-pink-500/50 text-pink-400 text-[10px] capitalize"
                        >
                          {currentQuestion.subject.toLowerCase()}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${difficultyColors[currentQuestion.difficulty]}`}
                        >
                          {currentQuestion.difficulty}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentQuestion(null);
                          setShowResult(false);
                        }}
                        className={`h-7 text-xs ${btnInteractive}`}
                      >
                        Back
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentQuestion.chapter} • {currentQuestion.topic}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 p-3 pt-0">
                    <div className="text-sm">
                      <LatexRenderer content={currentQuestion.questionText} />
                    </div>
                    <div className="space-y-2">
                      {currentQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => !showResult && setSelectedAnswer(idx)}
                          disabled={showResult}
                          className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                            showResult
                              ? idx === currentQuestion.correctAnswer
                                ? "border-green-500 bg-green-500/10"
                                : idx === selectedAnswer && !isCorrect
                                  ? "border-red-500 bg-red-500/10"
                                  : "border-white/10 bg-white/5 opacity-50"
                              : selectedAnswer === idx
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                              showResult
                                ? idx === currentQuestion.correctAnswer
                                  ? "bg-green-500 text-white"
                                  : idx === selectedAnswer && !isCorrect
                                    ? "bg-red-500 text-white"
                                    : "bg-white/10"
                                : selectedAnswer === idx
                                  ? "bg-purple-500 text-white"
                                  : "bg-white/10"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 text-sm">
                            <LatexRenderer content={opt} />
                          </span>
                          {showResult &&
                            idx === currentQuestion.correctAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            )}
                          {showResult &&
                            idx === selectedAnswer &&
                            !isCorrect && (
                              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            )}
                        </button>
                      ))}
                    </div>
                    {!showResult ? (
                      <Button
                        onClick={submitAnswer}
                        disabled={selectedAnswer === null || submittingAnswer}
                        className={`w-full h-9 ${btnPrimary}`}
                      >
                        {submittingAnswer ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          "Submit Answer"
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div
                          className={`p-3 rounded-lg border ${isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium text-sm">
                              {isCorrect ? "Correct!" : "Incorrect"}
                            </span>
                          </div>
                          {currentQuestion.explanation && (
                            <div className="text-xs text-muted-foreground mt-2">
                              <strong>Explanation:</strong>
                              <div className="mt-1">
                                <LatexRenderer
                                  content={currentQuestion.explanation}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentQuestion(null);
                            setShowResult(false);
                          }}
                          className={`w-full border-white/10 h-8 ${btnInteractive}`}
                        >
                          <ChevronRight className="h-4 w-4 mr-1" />
                          Next Question
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="border-white/10 bg-white/5">
                    <CardContent className="p-3">
                      <div className="flex flex-wrap gap-3 items-center">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select
                          value={questionFilters.class}
                          onValueChange={(v) =>
                            setQuestionFilters({
                              ...questionFilters,
                              class: v === "all" ? "" : v,
                            })
                          }
                        >
                          <SelectTrigger className="w-30 h-8 text-xs border-white/10 bg-white/5 cursor-pointer">
                            <SelectValue placeholder="All Classes" />
                          </SelectTrigger>
                          <SelectContent>
                            {["all", ...classLevels].map((c) => (
                              <SelectItem
                                key={c}
                                value={c}
                                className="cursor-pointer"
                              >
                                {c === "all" ? "All Classes" : `Class ${c}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={questionFilters.subject}
                          onValueChange={(v) =>
                            setQuestionFilters({
                              ...questionFilters,
                              subject: v === "all" ? "" : v,
                            })
                          }
                        >
                          <SelectTrigger className="w-35 h-8 text-xs border-white/10 bg-white/5 cursor-pointer">
                            <SelectValue placeholder="All Subjects" />
                          </SelectTrigger>
                          <SelectContent>
                            {["all", ...subjects].map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="cursor-pointer"
                              >
                                {s === "all"
                                  ? "All Subjects"
                                  : s.charAt(0) + s.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={questionFilters.difficulty}
                          onValueChange={(v) =>
                            setQuestionFilters({
                              ...questionFilters,
                              difficulty: v === "all" ? "" : v,
                            })
                          }
                        >
                          <SelectTrigger className="w-30 h-8 text-xs border-white/10 bg-white/5 cursor-pointer">
                            <SelectValue placeholder="All Levels" />
                          </SelectTrigger>
                          <SelectContent>
                            {["all", ...difficulties].map((d) => (
                              <SelectItem
                                key={d}
                                value={d}
                                className="cursor-pointer"
                              >
                                {d === "all"
                                  ? "All Levels"
                                  : d.charAt(0) + d.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {loadingQuestions ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : questions.length === 0 ? (
                    <Card className="border-white/10 bg-white/5">
                      <CardContent className="py-8 text-center">
                        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">
                          No questions available yet
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {questions.map((q, idx) => (
                        <Card
                          key={q.id}
                          className={`border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors cursor-pointer ${btnInteractive}`}
                          onClick={() => startQuestion(q)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex gap-1.5 mb-1.5 flex-wrap">
                                  <Badge
                                    variant="outline"
                                    className="border-purple-500/50 text-purple-400 text-[10px] px-1.5 py-0"
                                  >
                                    Class {q.classLevel}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="border-pink-500/50 text-pink-400 text-[10px] px-1.5 py-0 capitalize"
                                  >
                                    {q.subject.toLowerCase()}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1.5 py-0 ${difficultyColors[q.difficulty]}`}
                                  >
                                    {q.difficulty}
                                  </Badge>
                                </div>
                                <p className="font-medium text-sm truncate">
                                  Q{idx + 1}. {q.questionText.slice(0, 80)}
                                  {q.questionText.length > 80 ? "..." : ""}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {q.chapter} • {q.topic}
                                </p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* DOUBTS TAB */}
          {activeTab === "doubts" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-white/10 bg-white/5">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-cyan-400" />
                      Ask a Doubt
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Submit your question and get help
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3 pt-0">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Title</label>
                      <Input
                        placeholder="What's your question about?"
                        value={newDoubt.title}
                        onChange={(e) =>
                          setNewDoubt({ ...newDoubt, title: e.target.value })
                        }
                        className="h-8 text-sm border-white/10 bg-white/5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Description</label>
                      <Textarea
                        placeholder="Describe your doubt. Use $...$ for math."
                        value={newDoubt.description}
                        onChange={(e) =>
                          setNewDoubt({
                            ...newDoubt,
                            description: e.target.value,
                          })
                        }
                        className="min-h-24 text-sm border-white/10 bg-white/5"
                      />
                    </div>
                    <Button
                      onClick={submitDoubt}
                      disabled={submittingDoubt}
                      className={`w-full h-8 ${btnPrimary}`}
                    >
                      {submittingDoubt ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Doubt
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      Your Doubts
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Track your submitted doubts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    {loadingDoubts ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : doubts.length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted-foreground">
                        No doubts submitted yet
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-75 overflow-y-auto pr-1">
                        {doubts.map((d) => (
                          <div
                            key={d.id}
                            className="p-2.5 rounded-lg border border-white/10 bg-white/5"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h4 className="font-medium text-sm">{d.title}</h4>
                              <Badge
                                variant="outline"
                                className={`text-[10px] shrink-0 ${d.status === "RESOLVED" ? "border-green-500/50 text-green-400" : "border-yellow-500/50 text-yellow-400"}`}
                              >
                                {d.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              <LatexRenderer content={d.description} />
                            </p>
                            {d.response && (
                              <div className="mt-2 p-2 rounded bg-green-500/10 border border-green-500/20">
                                <p className="text-[10px] text-green-400 font-medium mb-0.5">
                                  Response:
                                </p>
                                <p className="text-xs">
                                  <LatexRenderer content={d.response} />
                                </p>
                              </div>
                            )}
                            <p className="text-[10px] text-muted-foreground mt-1.5">
                              {new Date(d.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* PROGRESS TAB */}
          {activeTab === "progress" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="border-white/10 bg-white/5">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Video className="h-4 w-4 text-purple-400" />
                      Video Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold mb-1">
                      {loadingStats
                        ? "..."
                        : `${stats?.videosWatched || 0}/${stats?.totalVideos || 0}`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Videos watched
                    </p>
                    <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-purple-500 to-pink-500"
                        style={{
                          width:
                            stats && stats.totalVideos > 0
                              ? `${(stats.videosWatched / stats.totalVideos) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-pink-400" />
                      Questions Solved
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold mb-1">
                      {loadingStats ? "..." : stats?.questionsSolved || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total attempts
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                      <span>{stats?.correctAnswers || 0} correct</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ChartLine className="h-4 w-4 text-cyan-400" />
                      Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold mb-1">
                      {loadingStats ? "..." : `${stats?.accuracy || 0}%`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Overall accuracy
                    </p>
                    <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-cyan-500 to-green-500"
                        style={{ width: `${stats?.accuracy || 0}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-white/10 bg-white/5">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm">Monthly Reports</CardTitle>
                  <CardDescription className="text-xs">
                    Detailed progress reports generated monthly
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground text-center py-6">
                    Monthly reports will be available after your first month of
                    activity.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ChartLine className="h-4 w-4 text-purple-400" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update your preferences to get personalized video
                    recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  {loadingProfile ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Name</label>
                        <Input
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Your name"
                          className="h-9 text-sm border-white/10 bg-white/5"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">
                            Class Level
                          </label>
                          <Select
                            value={profileForm.preferredClassLevel}
                            onValueChange={(v) =>
                              setProfileForm({
                                ...profileForm,
                                preferredClassLevel: v === "none" ? "" : v,
                              })
                            }
                          >
                            <SelectTrigger className="h-9 text-sm border-white/10 bg-white/5 cursor-pointer">
                              <SelectValue placeholder="Select your class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="none"
                                className="cursor-pointer"
                              >
                                No preference
                              </SelectItem>
                              {classLevels.map((c) => (
                                <SelectItem
                                  key={c}
                                  value={c}
                                  className="cursor-pointer"
                                >
                                  {["JEE", "WBJEE"].includes(c)
                                    ? c
                                    : `Class ${c}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground">
                            Videos matching your class will be shown first
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">
                            Preparation Goal
                          </label>
                          <Select
                            value={profileForm.preferredBatch}
                            onValueChange={(v) =>
                              setProfileForm({
                                ...profileForm,
                                preferredBatch: v === "none" ? "" : v,
                              })
                            }
                          >
                            <SelectTrigger className="h-9 text-sm border-white/10 bg-white/5 cursor-pointer">
                              <SelectValue placeholder="Select your goal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="none"
                                className="cursor-pointer"
                              >
                                No preference
                              </SelectItem>
                              {batches.map((b) => (
                                <SelectItem
                                  key={b}
                                  value={b}
                                  className="cursor-pointer"
                                >
                                  {b === "BOARDS"
                                    ? "Board Exams"
                                    : `${b} Preparation`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground">
                            Content will be tailored for your exam preparation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Button
                          onClick={saveProfile}
                          disabled={savingProfile}
                          className={`h-9 ${btnPrimary}`}
                        >
                          {savingProfile ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Preferences
                            </>
                          )}
                        </Button>
                        {profile?.preferredClassLevel ||
                        profile?.preferredBatch ? (
                          <div className="text-xs text-muted-foreground">
                            Current:{" "}
                            {profile.preferredClassLevel
                              ? `Class ${profile.preferredClassLevel}`
                              : ""}
                            {profile.preferredClassLevel &&
                            profile.preferredBatch
                              ? " • "
                              : ""}
                            {profile.preferredBatch || ""}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-pink-400" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-muted-foreground">Email</span>
                      <span>{profile?.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-muted-foreground">Role</span>
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 text-xs"
                      >
                        {profile?.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
