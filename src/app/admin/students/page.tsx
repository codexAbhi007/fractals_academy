"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Search,
  Loader2,
  BookOpen,
  Video,
  Target,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface StudentType {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  preferredClassLevel?: string | null;
  preferredBatch?: string | null;
  createdAt: string;
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
    videosWatched: number;
  };
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch {
      toast.error("Failed to fetch students");
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

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            View and manage student accounts
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-purple-500/50 text-purple-400"
        >
          {students.length} Total
        </Badge>
      </div>

      {/* Search */}
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-white/10 bg-white/5"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery
                ? "No students found matching your search"
                : "No students registered yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.image || undefined} />
                    <AvatarFallback className="bg-purple-500/20 text-purple-400">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {student.name}
                    </CardTitle>
                    <CardDescription className="truncate">
                      {student.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preferences */}
                <div className="flex flex-wrap gap-2">
                  {student.preferredClassLevel && (
                    <Badge
                      variant="outline"
                      className="border-purple-500/50 text-purple-400 text-xs"
                    >
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {["JEE", "WBJEE"].includes(student.preferredClassLevel)
                        ? student.preferredClassLevel
                        : `Class ${student.preferredClassLevel}`}
                    </Badge>
                  )}
                  {student.preferredBatch && (
                    <Badge
                      variant="outline"
                      className="border-pink-500/50 text-pink-400 text-xs"
                    >
                      {student.preferredBatch}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <BookOpen className="h-4 w-4 mx-auto text-cyan-400 mb-1" />
                    <p className="text-lg font-bold">
                      {student.stats.totalAttempts}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Attempts
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Target className="h-4 w-4 mx-auto text-green-400 mb-1" />
                    <p className="text-lg font-bold">
                      {student.stats.accuracy}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Accuracy
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Video className="h-4 w-4 mx-auto text-pink-400 mb-1" />
                    <p className="text-lg font-bold">
                      {student.stats.videosWatched}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Videos</p>
                  </div>
                </div>

                {/* Joined Date */}
                <p className="text-xs text-muted-foreground text-center">
                  Joined {new Date(student.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
