"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import {
  FloatingParticles,
  GlowingText,
  GridBackground,
  HoverBorderGradient,
  TextGenerateEffect,
} from "@/components/ui/aceternity";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

// Helper to detect client-side mounting
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function HeroSection() {
  const { data: session, isPending } = useSession();
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const isStudent = session?.user && !isAdmin;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-8">
      <GridBackground />
      <FloatingParticles />

      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Admissions Open
          </span>
        </motion.div>

        {/* <TextGenerateEffect
          words="Master Mathematics with"
          className="text-4xl md:text-6xl lg:text-7xl mb-2"
        /> */}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
          <GlowingText>Fractals Academy</GlowingText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10"
        >
          Comprehensive coaching for Class 7-12, JEE & WBJEE. Expert guidance by{" "}
          <span className="text-foreground font-semibold">Sayantan Sarcar</span>{" "}
          at Baruipur, Kolkata.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {mounted && !isPending && isAdmin ? (
            <Link href="/admin">
              <HoverBorderGradient>Go to Admin Panel</HoverBorderGradient>
            </Link>
          ) : mounted && !isPending && isStudent ? (
            <Link href="/dashboard">
              <HoverBorderGradient>Go to Dashboard</HoverBorderGradient>
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <HoverBorderGradient>Start Learning Today</HoverBorderGradient>
              </Link>

              <Link href="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full border border-white/10 hover:bg-white/5"
                >
                  Sign In →
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Contact Now Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-6"
        >
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all group cursor-pointer"
          >
            <span className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-40" />
              <span className="relative inline-flex h-8 w-8 rounded-full bg-green-500 items-center justify-center">
                <Phone className="h-4 w-4 text-white animate-[wiggle_0.5s_ease-in-out_infinite]" />
              </span>
            </span>
            <div className="text-left">
              <div className="text-xs text-green-400 font-medium">Call Now</div>
              <div className="text-lg font-bold text-white group-hover:text-green-300 transition-colors">
                +91 62910 05461
              </div>
            </div>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { number: "500+", label: "Students Taught" },
            { number: "95%", label: "Success Rate" },
            { number: "6+", label: "Years Experience" },
            { number: "1000+", label: "Problems Solved" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">Scroll to explore</span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
