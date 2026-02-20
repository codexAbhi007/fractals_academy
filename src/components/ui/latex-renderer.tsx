"use client";

import { useMemo } from "react";
import katex from "katex";

interface LatexRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders LaTeX content inline with text.
 * Supports both inline ($...$) and display ($$...$$) math.
 */
export function LatexRenderer({ content, className = "" }: LatexRendererProps) {
  const html = useMemo(() => renderLatexContent(content), [content]);

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/**
 * Renders LaTeX content, replacing $...$ and $$...$$ with rendered HTML
 */
function renderLatexContent(content: string): string {
  if (!content) return "";

  try {
    // First, handle display mode ($$...$$)
    let result = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, latex) => {
      try {
        return katex.renderToString(latex.trim(), {
          displayMode: true,
          throwOnError: false,
          output: "html",
        });
      } catch {
        return `<span class="text-red-500">[LaTeX Error]</span>`;
      }
    });

    // Then, handle inline mode ($...$)
    result = result.replace(/\$([^$]+?)\$/g, (_, latex) => {
      try {
        return katex.renderToString(latex.trim(), {
          displayMode: false,
          throwOnError: false,
          output: "html",
        });
      } catch {
        return `<span class="text-red-500">[LaTeX Error]</span>`;
      }
    });

    return result;
  } catch {
    return content;
  }
}

/**
 * Preview component that shows rendered LaTeX with a compact design
 */
export function LatexPreview({
  content,
  className = "",
  label = "Preview",
}: {
  content: string;
  className?: string;
  label?: string;
}) {
  if (!content.trim()) {
    return (
      <div className={`text-sm text-muted-foreground italic ${className}`}>
        {label} will appear here...
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="p-3 rounded-lg border border-white/10 bg-white/5">
        <LatexRenderer content={content} />
      </div>
    </div>
  );
}
