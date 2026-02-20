"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Play, Link as LinkIcon } from "lucide-react";
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

interface CategoriesData {
  classes: string[];
  subjects: string[];
  chapters: Record<string, string[]>;
}

export default function NewVideoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoriesData | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [preview, setPreview] = useState<{
    id: string;
    thumbnail: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    classLevel: "",
    subject: "",
    chapter: "",
    topic: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, youtubeUrl: url });

    const videoId = extractYouTubeId(url);
    if (videoId) {
      setPreview({
        id: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      });
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.youtubeUrl || !formData.classLevel || !formData.subject) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create video");
      }

      toast.success("Video added successfully!");
      router.push("/admin/videos");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add video",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
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
          <h1 className="text-2xl font-bold">Add New Video</h1>
          <p className="text-muted-foreground">
            Paste a YouTube URL to add a video lecture
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube URL */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg">YouTube Link</CardTitle>
            <CardDescription>
              Paste the YouTube video URL and we&apos;ll automatically fetch the
              title and thumbnail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">Video URL *</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="youtubeUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="pl-10 border-white/10 bg-white/5"
                  value={formData.youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                <img
                  src={preview.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categorization */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Categorization</CardTitle>
            <CardDescription>
              Help students find this video by categorizing it properly
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
            disabled={isLoading || !preview}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Video...
              </>
            ) : (
              "Add Video"
            )}
          </Button>
          <Link href="/admin/videos">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
