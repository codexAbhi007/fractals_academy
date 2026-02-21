"use client";

import { LatexRenderer } from "@/components/ui/latex-renderer";

interface QuestionOptionsProps {
  options: string[];
  correctAnswer: number;
}

export function QuestionOptions({ options, correctAnswer }: QuestionOptionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
      {options.map((option, optIndex) => (
        <div
          key={optIndex}
          className={`p-2 rounded-lg border ${
            optIndex === correctAnswer
              ? "border-green-500/50 bg-green-500/10 text-green-400"
              : "border-white/10 bg-white/5 text-muted-foreground"
          }`}
        >
          <span className="font-medium mr-1">
            {String.fromCharCode(65 + optIndex)}.
          </span>
          <span className="wrap-break-word">
            <LatexRenderer 
              content={option.length > 50 ? option.slice(0, 50) + "..." : option} 
            />
          </span>
        </div>
      ))}
    </div>
  );
}
