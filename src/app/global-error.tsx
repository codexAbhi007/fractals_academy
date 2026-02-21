"use client";

import { Inter } from "next/font/google";
import { AlertTriangle, RefreshCw } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-size-[24px_24px]" />

          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center px-4">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Critical Error
            </h1>
            <p className="text-gray-400 text-lg mb-4 max-w-md mx-auto">
              A critical error occurred in the application. We apologize for the
              inconvenience.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mb-8 font-mono">
                Error ID: {error.digest}
              </p>
            )}

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <div className="mt-12 p-4 rounded-lg bg-white/5 border border-white/10 max-w-md mx-auto">
              <p className="text-sm text-gray-400">
                <span className="font-medium text-white">What happened?</span>
                <br />
                The application encountered a fatal error. This may be due to a
                server issue or network problem. Please refresh the page.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
