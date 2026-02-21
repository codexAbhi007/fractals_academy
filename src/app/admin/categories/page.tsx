"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  BookOpen,
  FolderOpen,
  Plus,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoriesData {
  classes: string[];
  subjects: string[];
  chapters: Record<string, string[]>;
}

export default function AdminCategoriesPage() {
  const [data, setData] = useState<CategoriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Edit states
  const [editingClasses, setEditingClasses] = useState<string[]>([]);
  const [editingSubjects, setEditingSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [editingChapters, setEditingChapters] = useState<string[]>([]);

  // Add dialogs
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [addChapterOpen, setAddChapterOpen] = useState(false);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setEditingClasses(json.classes);
        setEditingSubjects(json.subjects);
        if (json.subjects.length > 0) {
          setSelectedSubject(json.subjects[0]);
          setEditingChapters(json.chapters[json.subjects[0]] || []);
        }
      }
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setEditingChapters(data?.chapters[subject] || []);
  };

  const saveClasses = async () => {
    setSaving("classes");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "classes", values: editingClasses }),
      });
      if (res.ok) {
        toast.success("Classes saved!");
        fetchCategories();
      } else {
        toast.error("Failed to save classes");
      }
    } catch {
      toast.error("Failed to save classes");
    } finally {
      setSaving(null);
    }
  };

  const saveSubjects = async () => {
    setSaving("subjects");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subjects", values: editingSubjects }),
      });
      if (res.ok) {
        toast.success("Subjects saved!");
        fetchCategories();
      } else {
        toast.error("Failed to save subjects");
      }
    } catch {
      toast.error("Failed to save subjects");
    } finally {
      setSaving(null);
    }
  };

  const saveChapters = async () => {
    if (!selectedSubject) return;
    setSaving("chapters");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chapters",
          subject: selectedSubject,
          values: editingChapters,
        }),
      });
      if (res.ok) {
        toast.success("Chapters saved!");
        fetchCategories();
      } else {
        toast.error("Failed to save chapters");
      }
    } catch {
      toast.error("Failed to save chapters");
    } finally {
      setSaving(null);
    }
  };

  const addClass = () => {
    if (newValue.trim() && !editingClasses.includes(newValue.trim())) {
      setEditingClasses([...editingClasses, newValue.trim()]);
      setNewValue("");
      setAddClassOpen(false);
    }
  };

  const removeClass = (val: string) => {
    setEditingClasses(editingClasses.filter((c) => c !== val));
  };

  const addSubject = () => {
    if (
      newValue.trim() &&
      !editingSubjects.includes(newValue.trim().toUpperCase())
    ) {
      setEditingSubjects([...editingSubjects, newValue.trim().toUpperCase()]);
      setNewValue("");
      setAddSubjectOpen(false);
    }
  };

  const removeSubject = (val: string) => {
    setEditingSubjects(editingSubjects.filter((s) => s !== val));
  };

  const addChapter = () => {
    if (newValue.trim() && !editingChapters.includes(newValue.trim())) {
      setEditingChapters([...editingChapters, newValue.trim()]);
      setNewValue("");
      setAddChapterOpen(false);
    }
  };

  const removeChapter = (val: string) => {
    setEditingChapters(editingChapters.filter((c) => c !== val));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground">
            Configure classes, subjects, and chapters for your platform
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchCategories}
          className="border-white/10 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-400" />
              Classes
            </CardTitle>
            <CardDescription>
              Manage class levels (7-12, JEE, WBJEE, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {editingClasses.map((cls) => (
                <Badge
                  key={cls}
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 px-3 py-1 text-sm"
                >
                  {cls}
                  <button
                    onClick={() => removeClass(cls)}
                    className="ml-2 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddClassOpen(true)}
                className="border-dashed border-white/20 h-7 cursor-pointer"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <Button
              onClick={saveClasses}
              disabled={saving === "classes"}
              className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
            >
              {saving === "classes" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Classes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-pink-400" />
              Subjects
            </CardTitle>
            <CardDescription>
              Manage available subjects (Math, Physics, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {editingSubjects.map((subj) => (
                <Badge
                  key={subj}
                  variant="outline"
                  className="border-pink-500/50 text-pink-400 px-3 py-1 text-sm capitalize"
                >
                  {subj.toLowerCase()}
                  <button
                    onClick={() => removeSubject(subj)}
                    className="ml-2 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddSubjectOpen(true)}
                className="border-dashed border-white/20 h-7 cursor-pointer"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <Button
              onClick={saveSubjects}
              disabled={saving === "subjects"}
              className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
            >
              {saving === "subjects" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Subjects
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Chapters */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-cyan-400" />
            Chapters
          </CardTitle>
          <CardDescription>
            Manage chapters for each subject. Select a subject to edit its
            chapters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-[200px] border-white/10 bg-white/5 cursor-pointer">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {editingSubjects.map((subj) => (
                <SelectItem
                  key={subj}
                  value={subj}
                  className="capitalize cursor-pointer"
                >
                  {subj.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSubject && (
            <>
              <div className="border border-white/10 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                <div className="space-y-2">
                  {editingChapters.map((chap, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10"
                    >
                      <span className="text-sm">{chap}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChapter(chap)}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {editingChapters.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No chapters yet. Add one below.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAddChapterOpen(true)}
                  className="border-white/10 cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chapter
                </Button>
                <Button
                  onClick={saveChapters}
                  disabled={saving === "chapters"}
                  className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
                >
                  {saving === "chapters" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Chapters for {selectedSubject}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Class Dialog */}
      <Dialog open={addClassOpen} onOpenChange={setAddClassOpen}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
            <DialogDescription>Enter a new class level</DialogDescription>
          </DialogHeader>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="e.g., 13, NEET, etc."
            className="border-white/10 bg-white/5"
            onKeyDown={(e) => e.key === "Enter" && addClass()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddClassOpen(false)}
              className="border-white/10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={addClass}
              className="bg-linear-to-r from-purple-500 to-pink-500 cursor-pointer"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={addSubjectOpen} onOpenChange={setAddSubjectOpen}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
            <DialogDescription>Enter a new subject name</DialogDescription>
          </DialogHeader>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="e.g., Biology, Computer Science, etc."
            className="border-white/10 bg-white/5"
            onKeyDown={(e) => e.key === "Enter" && addSubject()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddSubjectOpen(false)}
              className="border-white/10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={addSubject}
              className="bg-linear-to-r from-purple-500 to-pink-500 cursor-pointer"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Chapter Dialog */}
      <Dialog open={addChapterOpen} onOpenChange={setAddChapterOpen}>
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle>Add Chapter</DialogTitle>
            <DialogDescription>
              Enter a new chapter for {selectedSubject}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="e.g., Quadratic Equations"
            className="border-white/10 bg-white/5"
            onKeyDown={(e) => e.key === "Enter" && addChapter()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddChapterOpen(false)}
              className="border-white/10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={addChapter}
              className="bg-linear-to-r from-purple-500 to-pink-500 cursor-pointer"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
