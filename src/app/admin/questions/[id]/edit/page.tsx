"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Eye, Code, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LatexRenderer } from "@/components/ui/latex-renderer";

const difficulties = ["EASY", "MEDIUM", "HARD"] as const;

interface CategoriesData {
  classes: string[];
  subjects: string[];
  chapters: Record<string, string[]>;
}

interface QuestionData {
  id: string;
  classLevel: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: string;
  questionText: string;
  questionImage: string | null;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
}

export default function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Dynamic categories
  const [categories, setCategories] = useState<CategoriesData | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state
  const [classLevel, setClassLevel] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionImage, setQuestionImage] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>("");

  // Fetch categories
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

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/admin/questions/${id}`);
        if (!res.ok) {
          throw new Error("Question not found");
        }
        const data = await res.json();
        const q: QuestionData = data.question;

        setClassLevel(q.classLevel);
        setSubject(q.subject);
        setChapter(q.chapter);
        setTopic(q.topic);
        setDifficulty(q.difficulty);
        setQuestionText(q.questionText);
        setQuestionImage(q.questionImage || "");
        setOptions(q.options);
        setCorrectAnswer(q.correctAnswer);
        setExplanation(q.explanation || "");
      } catch {
        toast.error("Failed to load question");
        router.push("/admin/questions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestion();
  }, [id, router]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!classLevel || !subject || !chapter || !topic || !difficulty) {
      toast.error("Please fill in all category fields");
      return;
    }
    if (!questionText.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      toast.error("All 4 options are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classLevel,
          subject,
          chapter,
          topic,
          difficulty,
          questionText,
          questionImage: questionImage || null,
          options,
          correctAnswer,
          explanation: explanation || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update question");
      }

      toast.success("Question updated successfully!");
      router.push("/admin/questions");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update question"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableChapters =
    subject && categories ? categories.chapters[subject] || [] : [];

  if (isLoading || loadingCategories) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/questions">
          <Button variant="ghost" size="icon" className="border-white/10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Question</h1>
          <p className="text-muted-foreground">
            Update the question details
          </p>
        </div>
      </div>

      {/* LaTeX Help */}
      <Card className="border-purple-500/20 bg-purple-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Code className="h-4 w-4" />
            LaTeX Syntax Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>
            <span className="text-purple-400">Inline math:</span> Wrap with{" "}
            <code className="bg-white/10 px-1 rounded">$...$</code> — e.g.,{" "}
            <code className="bg-white/10 px-1 rounded">$x^2 + y^2 = r^2$</code>
          </p>
          <p>
            <span className="text-purple-400">Display math:</span> Wrap with{" "}
            <code className="bg-white/10 px-1 rounded">$$...$$</code> — e.g.,{" "}
            <code className="bg-white/10 px-1 rounded">
              $$\int_0^\infty e^{"{-x^2}"} dx$$
            </code>
          </p>
          <p>
            <span className="text-purple-400">Common:</span>{" "}
            <code className="bg-white/10 px-1 rounded">\frac{"{a}{b}"}</code>,{" "}
            <code className="bg-white/10 px-1 rounded">\sqrt{"{x}"}</code>,{" "}
            <code className="bg-white/10 px-1 rounded">\sum</code>,{" "}
            <code className="bg-white/10 px-1 rounded">\alpha</code>,{" "}
            <code className="bg-white/10 px-1 rounded">\theta</code>
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Question Category</CardTitle>
            <CardDescription>
              Classify the question for proper organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Class Level *</Label>
                <Select value={classLevel} onValueChange={setClassLevel}>
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories?.classes || []).map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls.match(/^\d+$/) ? `Class ${cls}` : cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select
                  value={subject}
                  onValueChange={(val) => {
                    setSubject(val);
                    setChapter("");
                  }}
                >
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories?.subjects || []).map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub.charAt(0) + sub.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty *</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff.charAt(0) + diff.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chapter *</Label>
                <Select
                  value={chapter}
                  onValueChange={setChapter}
                  disabled={!subject}
                >
                  <SelectTrigger className="border-white/10 bg-white/5">
                    <SelectValue
                      placeholder={
                        subject ? "Select chapter" : "Select subject first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableChapters.map((ch) => (
                      <SelectItem key={ch} value={ch}>
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Topic *</Label>
                <Input
                  placeholder="e.g., Newton's Laws of Motion"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="border-white/10 bg-white/5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Content */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Question Content</CardTitle>
            <CardDescription>
              Write the question with LaTeX for mathematical notation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
            >
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger
                  value="edit"
                  className="data-[state=active]:bg-purple-500/20"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Edit
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-purple-500/20"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    placeholder="Enter your question here. Use $...$ for inline LaTeX and $$...$$ for display math."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="min-h-30 border-white/10 bg-white/5 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Question Image URL (Optional)
                  </Label>
                  <Input
                    placeholder="https://example.com/question-diagram.png"
                    value={questionImage}
                    onChange={(e) => setQuestionImage(e.target.value)}
                    className="border-white/10 bg-white/5"
                  />
                  {questionImage && (
                    <div className="mt-2 p-2 border border-white/10 rounded-lg">
                      <img
                        src={questionImage}
                        alt="Question preview"
                        className="max-h-40 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Answer Options *</Label>
                  {options.map((opt, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium ${
                          correctAnswer === index
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : "bg-white/5 text-muted-foreground border border-white/10"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <Input
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )} - supports LaTeX`}
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="flex-1 border-white/10 bg-white/5 font-mono"
                      />
                      <Button
                        type="button"
                        variant={
                          correctAnswer === index ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCorrectAnswer(index)}
                        className={
                          correctAnswer === index
                            ? "bg-green-500 hover:bg-green-600"
                            : "border-white/10"
                        }
                      >
                        {correctAnswer === index ? "✓ Correct" : "Mark Correct"}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Explanation (Optional)</Label>
                  <Textarea
                    placeholder="Provide a detailed explanation of the solution. Supports LaTeX."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="min-h-20 border-white/10 bg-white/5 font-mono"
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4 space-y-4">
                <Card className="border-white/10 bg-black/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      Question Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-lg">
                      {questionText ? (
                        <LatexRenderer content={questionText} />
                      ) : (
                        <span className="text-muted-foreground italic">
                          No question text entered
                        </span>
                      )}
                    </div>

                    {questionImage && (
                      <div className="py-2">
                        <img
                          src={questionImage}
                          alt="Question image"
                          className="max-h-60 rounded-lg border border-white/10"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {options.map((opt, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            correctAnswer === index
                              ? "border-green-500/50 bg-green-500/10"
                              : "border-white/10 bg-white/5"
                          }`}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {opt ? (
                            <LatexRenderer content={opt} />
                          ) : (
                            <span className="text-muted-foreground italic">
                              Empty
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {explanation && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="text-sm text-muted-foreground mb-2">
                          Explanation:
                        </div>
                        <div className="text-sm">
                          <LatexRenderer content={explanation} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/questions">
            <Button variant="outline" className="border-white/10">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Question"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
