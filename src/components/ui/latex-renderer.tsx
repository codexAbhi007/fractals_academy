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
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/**
 * Renders LaTeX content, replacing $...$ and $$...$$ with rendered HTML,
 * and also handling common text-mode LaTeX commands outside math delimiters.
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

    // Handle text-mode LaTeX commands outside math delimiters
    // \textbf{...} → bold
    result = result.replace(/\\textbf\{([^}]*)\}/g, "<strong>$1</strong>");
    // \textit{...} → italic
    result = result.replace(/\\textit\{([^}]*)\}/g, "<em>$1</em>");
    // \emph{...} → italic
    result = result.replace(/\\emph\{([^}]*)\}/g, "<em>$1</em>");
    // \underline{...} → underline
    result = result.replace(
      /\\underline\{([^}]*)\}/g,
      '<span style="text-decoration:underline">$1</span>',
    );
    // \texttt{...} → monospace
    result = result.replace(
      /\\texttt\{([^}]*)\}/g,
      '<code class="text-sm bg-white/10 px-1 rounded">$1</code>',
    );
    // \text{...} → plain text (just unwrap)
    result = result.replace(/\\text\{([^}]*)\}/g, "$1");
    // \newline or \\ → line break
    result = result.replace(/\\newline/g, "<br />");
    result = result.replace(/\\\\/g, "<br />");
    // \hspace{...} → horizontal space
    result = result.replace(
      /\\hspace\{([^}]*)\}/g,
      '<span style="margin-left:$1"></span>',
    );
    // \vspace{...} → vertical space
    result = result.replace(
      /\\vspace\{([^}]*)\}/g,
      '<div style="margin-top:$1"></div>',
    );

    // \begin{itemize}...\end{itemize} → unordered list
    result = result.replace(
      /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
      (_, inner) => {
        const items = inner
          .split(/\\item\s*/)
          .filter((s: string) => s.trim())
          .map((s: string) => `<li>${s.trim()}</li>`)
          .join("");
        return `<ul class="list-disc list-inside ml-4 my-2">${items}</ul>`;
      },
    );

    // \begin{enumerate}...\end{enumerate} → ordered list
    result = result.replace(
      /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
      (_, inner) => {
        const items = inner
          .split(/\\item\s*/)
          .filter((s: string) => s.trim())
          .map((s: string) => `<li>${s.trim()}</li>`)
          .join("");
        return `<ol class="list-decimal list-inside ml-4 my-2">${items}</ol>`;
      },
    );

    // Standalone \item (outside environments) → bullet point
    result = result.replace(/\\item\s*/g, "<br />• ");

    // \begin{center}...\end{center} → centered text
    result = result.replace(
      /\\begin\{center\}([\s\S]*?)\\end\{center\}/g,
      '<div style="text-align:center">$1</div>',
    );

    // Font size commands
    // \tiny{...}
    result = result.replace(
      /\\tiny\{([^}]*)\}/g,
      '<span style="font-size:0.6em">$1</span>',
    );
    // \scriptsize{...}
    result = result.replace(
      /\\scriptsize\{([^}]*)\}/g,
      '<span style="font-size:0.7em">$1</span>',
    );
    // \footnotesize{...}
    result = result.replace(
      /\\footnotesize\{([^}]*)\}/g,
      '<span style="font-size:0.8em">$1</span>',
    );
    // \small{...}
    result = result.replace(
      /\\small\{([^}]*)\}/g,
      '<span style="font-size:0.9em">$1</span>',
    );
    // \large{...}
    result = result.replace(
      /\\large\{([^}]*)\}/g,
      '<span style="font-size:1.2em">$1</span>',
    );
    // \Large{...}
    result = result.replace(
      /\\Large\{([^}]*)\}/g,
      '<span style="font-size:1.4em">$1</span>',
    );
    // \LARGE{...}
    result = result.replace(
      /\\LARGE\{([^}]*)\}/g,
      '<span style="font-size:1.7em">$1</span>',
    );
    // \huge{...}
    result = result.replace(
      /\\huge\{([^}]*)\}/g,
      '<span style="font-size:2em">$1</span>',
    );
    // \Huge{...}
    result = result.replace(
      /\\Huge\{([^}]*)\}/g,
      '<span style="font-size:2.5em">$1</span>',
    );

    // \textcolor{color}{text}
    result = result.replace(
      /\\textcolor\{([^}]*)\}\{([^}]*)\}/g,
      '<span style="color:$1">$2</span>',
    );

    // \href{url}{text}
    result = result.replace(
      /\\href\{([^}]*)\}\{([^}]*)\}/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-purple-400 underline">$2</a>',
    );

    // \section{...} \subsection{...} \subsubsection{...}
    result = result.replace(
      /\\section\{([^}]*)\}/g,
      '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>',
    );
    result = result.replace(
      /\\subsection\{([^}]*)\}/g,
      '<h3 class="text-lg font-semibold mt-3 mb-1">$1</h3>',
    );
    result = result.replace(
      /\\subsubsection\{([^}]*)\}/g,
      '<h4 class="text-base font-medium mt-2 mb-1">$1</h4>',
    );

    // \par → paragraph break
    result = result.replace(/\\par\b/g, '<div class="mb-3"></div>');

    // \noindent → just remove it
    result = result.replace(/\\noindent\b/g, "");

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
