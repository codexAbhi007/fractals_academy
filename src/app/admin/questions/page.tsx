import Link from "next/link";
import { db } from "@/db";
import { question } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Plus, Edit, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteQuestionButton } from "./delete-question-button";
import { QuestionOptions } from "./question-options";

async function getQuestions() {
  return await db.select().from(question).orderBy(desc(question.createdAt));
}

const difficultyColors = {
  EASY: "bg-green-500/20 text-green-400",
  MEDIUM: "bg-yellow-500/20 text-yellow-400",
  HARD: "bg-red-500/20 text-red-400",
};

export default async function AdminQuestionsPage() {
  const questions = await getQuestions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground">
            Manage practice questions with LaTeX support
          </p>
        </div>
        <Link href="/admin/questions/new">
          <Button className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </Link>
      </div>

      {questions.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No questions created yet
            </p>
            <Link href="/admin/questions/new">
              <Button variant="outline" className="border-white/10">
                <Plus className="h-4 w-4 mr-2" />
                Create your first question
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <Card
              key={q.id}
              className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-400"
                      >
                        Class {q.classLevel}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-pink-500/50 text-pink-400 capitalize"
                      >
                        {q.subject.toLowerCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={difficultyColors[q.difficulty]}
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-medium">
                      Q{index + 1}. {q.questionText.slice(0, 150)}
                      {q.questionText.length > 150 ? "..." : ""}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {q.chapter} • {q.topic}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/questions/${q.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteQuestionButton questionId={q.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <QuestionOptions
                  options={q.options as string[]}
                  correctAnswer={q.correctAnswer}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
