"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Send,
  Loader2,
  Trash2,
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LatexRenderer } from "@/components/ui/latex-renderer";

interface DoubtType {
  id: string;
  title: string;
  description: string;
  status: string;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  userId: string;
  userName?: string;
  userEmail?: string;
}

export default function AdminDoubtsPage() {
  const [doubts, setDoubts] = useState<DoubtType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState<DoubtType | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      const res = await fetch("/api/admin/doubts");
      if (res.ok) {
        const data = await res.json();
        setDoubts(data.doubts || []);
      }
    } catch {
      toast.error("Failed to fetch doubts");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!selectedDoubt || !responseText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/doubts/${selectedDoubt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responseText, status: "RESOLVED" }),
      });
      if (res.ok) {
        toast.success("Response sent successfully!");
        setSelectedDoubt(null);
        setResponseText("");
        fetchDoubts();
      } else {
        toast.error("Failed to send response");
      }
    } catch {
      toast.error("Failed to send response");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/doubts/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Doubt deleted");
        setDeleteConfirm(null);
        fetchDoubts();
      } else {
        toast.error("Failed to delete doubt");
      }
    } catch {
      toast.error("Failed to delete doubt");
    } finally {
      setDeleting(false);
    }
  };

  const pendingDoubts = doubts.filter((d) => d.status === "PENDING");
  const resolvedDoubts = doubts.filter((d) => d.status === "RESOLVED");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Doubts</h1>
          <p className="text-muted-foreground">Respond to student questions</p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="border-yellow-500/50 text-yellow-400"
          >
            {pendingDoubts.length} Pending
          </Badge>
          <Badge
            variant="outline"
            className="border-green-500/50 text-green-400"
          >
            {resolvedDoubts.length} Resolved
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : doubts.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="py-12 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No doubts submitted yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pending Doubts */}
          {pendingDoubts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                Pending ({pendingDoubts.length})
              </h2>
              <div className="space-y-3">
                {pendingDoubts.map((doubt) => (
                  <Card
                    key={doubt.id}
                    className="border-white/10 bg-white/5 border-l-4 border-l-yellow-500"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {doubt.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3" />
                            {doubt.userName || "Unknown"} ({doubt.userEmail})
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-yellow-500/50 text-yellow-400"
                          >
                            PENDING
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 cursor-pointer"
                            onClick={() => setDeleteConfirm(doubt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <LatexRenderer content={doubt.description} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(doubt.createdAt).toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
                          onClick={() => {
                            setSelectedDoubt(doubt);
                            setResponseText(doubt.response || "");
                          }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Respond
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Resolved Doubts */}
          {resolvedDoubts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                Resolved ({resolvedDoubts.length})
              </h2>
              <div className="space-y-3">
                {resolvedDoubts.map((doubt) => (
                  <Card
                    key={doubt.id}
                    className="border-white/10 bg-white/5 border-l-4 border-l-green-500"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {doubt.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3" />
                            {doubt.userName || "Unknown"} ({doubt.userEmail})
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-green-500/50 text-green-400"
                          >
                            RESOLVED
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 cursor-pointer"
                            onClick={() => setDeleteConfirm(doubt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-muted-foreground mb-1">
                          Question:
                        </p>
                        <LatexRenderer content={doubt.description} />
                      </div>
                      {doubt.response && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-xs text-green-400 mb-1">
                            Response:
                          </p>
                          <LatexRenderer content={doubt.response} />
                          {doubt.respondedAt && (
                            <p className="text-[10px] text-muted-foreground mt-2">
                              Responded:{" "}
                              {new Date(doubt.respondedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Asked: {new Date(doubt.createdAt).toLocaleString()}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/10 cursor-pointer"
                          onClick={() => {
                            setSelectedDoubt(doubt);
                            setResponseText(doubt.response || "");
                          }}
                        >
                          Edit Response
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response Dialog */}
      <Dialog
        open={!!selectedDoubt}
        onOpenChange={() => setSelectedDoubt(null)}
      >
        <DialogContent className="sm:max-w-150 border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle>Respond to Doubt</DialogTitle>
            <DialogDescription>{selectedDoubt?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 max-h-40 overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-1">
                Student&apos;s Question:
              </p>
              <LatexRenderer content={selectedDoubt?.description || ""} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Your Response (LaTeX supported)
              </label>
              <Textarea
                placeholder="Type your response here. Use $...$ for inline math and $$...$$ for block math."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-37.5 border-white/10 bg-white/5"
              />
            </div>
            {responseText && (
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-400 mb-1">Preview:</p>
                <LatexRenderer content={responseText} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedDoubt(null)}
              className="border-white/10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRespond}
              disabled={!responseText.trim() || submitting}
              className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="border-white/10 bg-background">
          <DialogHeader>
            <DialogTitle>Delete Doubt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this doubt? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="border-white/10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleting}
              className="cursor-pointer"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
