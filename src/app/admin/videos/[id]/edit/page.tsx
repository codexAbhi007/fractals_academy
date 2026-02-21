"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { use } from "react";

interface CategoriesData {
  classes: string[];
  subjects: string[];
  chapters: Record<string, string[]>;
}

interface VideoData {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  classLevel: string;
  subject: string;
  chapter: string | null;
  topic: string | null;
  description: string | null;
}

export default function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [categories, setCategories] = useState<CategoriesData | null>(null);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [formData, setFormData] = useState({
    classLevel: "",
    subject: "",
    chapter: "",
    topic: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/videos/${id}`),
          fetch("/api/categories"),
        ]);

        if (videoRes.ok) {
          const videoData = await videoRes.json();
          setVideo(videoData.video);
          setFormData({
            classLevel: videoData.video.classLevel || "",
            subject: videoData.video.subject || "",
            chapter: videoData.video.chapter || "",
            topic: videoData.video.topic || "",
            description: videoData.video.description || "",
          });
        } else {
          toast.error("Video not found");
          router.push("/admin/videos");
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch {
        toast.error("Failed to load video");
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [id, router]);

  const classLevels = categories?.classes || [
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "JEE",
    "WBJEE",
  ];
  const subjects = categories?.subjects || [
    "MATHEMATICS",
    "PHYSICS",
    "CHEMISTRY",
    "SCIENCE",
  ];
  const availableChapters =
    formData.subject && categories
      ? categories.chapters[formData.subject] || []
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.classLevel || !formData.subject) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update video");
      }

      toast.success("Video updated successfully!");
      router.push("/admin/videos");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update video",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/videos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Video</h1>
          <p className="text-muted-foreground line-clamp-1">{video.title}</p>
        </div>
      </div>

      {/* Video Preview */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-lg">Video Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              >
                <Play className="h-8 w-8 text-white fill-white" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Categorization */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Categorization</CardTitle>
            <CardDescription>
              Update how students find this video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classLevel">Class Level *</Label>
                <Select
                  value={formData.classLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, classLevel: value })
                  }
                >
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.match(/^\d+$/) ? `Class ${level}` : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subject: value, chapter: "" })
                  }
                >
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject.charAt(0) + subject.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chapter">Chapter</Label>
                <Select
                  value={formData.chapter}
                  onValueChange={(value) =>
                    setFormData({ ...formData, chapter: value })
                  }
                  disabled={!formData.subject}
                >
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue
                      placeholder={
                        formData.subject
                          ? "Select chapter"
                          : "Select subject first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableChapters.map((chapter) => (
                      <SelectItem key={chapter} value={chapter}>
                        {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Solving using Formula"
                  className="border-white/10 bg-white/5"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description or notes for students..."
                className="border-white/10 bg-white/5 min-h-[100px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Link href="/admin/videos">
            <Button type="button" variant="ghost" className="cursor-pointer">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
