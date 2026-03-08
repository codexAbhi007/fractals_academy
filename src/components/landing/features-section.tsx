"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Brain,
  ChartLine,
  GraduationCap,
  Users,
  Video,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Video Lectures",
    description:
      "Access recorded lessons anytime. Learn at your own pace with detailed explanations and visual aids.",
    gradient: "from-violet-500 to-purple-600",
    iconColor: "text-violet-400",
    titleHoverColor: "group-hover:text-violet-400",
    accentBg: "bg-violet-500",
    size: "large", // spans 2 cols
  },
  {
    icon: BookOpen,
    title: "Question Bank",
    description:
      "Extensive practice problems with LaTeX-rendered solutions organized by topic and difficulty.",
    gradient: "from-blue-500 to-cyan-500",
    iconColor: "text-blue-400",
    titleHoverColor: "group-hover:text-blue-400",
    accentBg: "bg-blue-500",
    size: "normal",
  },
  {
    icon: Brain,
    title: "Adaptive Learning",
    description:
      "Smart recommendations based on your performance to focus on weak areas.",
    gradient: "from-pink-500 to-rose-500",
    iconColor: "text-pink-400",
    titleHoverColor: "group-hover:text-pink-400",
    accentBg: "bg-pink-500",
    size: "normal",
  },
  {
    icon: ChartLine,
    title: "Progress Analytics",
    description:
      "Detailed analytics to identify strengths and weaknesses with monthly reports.",
    gradient: "from-emerald-500 to-teal-500",
    iconColor: "text-emerald-400",
    titleHoverColor: "group-hover:text-emerald-400",
    accentBg: "bg-emerald-500",
    size: "normal",
  },
  {
    icon: Users,
    title: "Doubt Resolution",
    description:
      "Direct support from Sayantan Sir. Get your questions answered promptly.",
    gradient: "from-amber-500 to-orange-500",
    iconColor: "text-amber-400",
    titleHoverColor: "group-hover:text-amber-400",
    accentBg: "bg-amber-500",
    size: "normal",
  },
  {
    icon: GraduationCap,
    title: "Exam Strategies",
    description:
      "Time management, question selection, and strategies for competitive success.",
    gradient: "from-indigo-500 to-violet-500",
    iconColor: "text-indigo-400",
    titleHoverColor: "group-hover:text-indigo-400",
    accentBg: "bg-indigo-500",
    size: "large", // spans 2 cols
  },
];

function FeatureItem({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const isLarge = feature.size === "large";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "group relative",
        isLarge ? "md:col-span-2" : "md:col-span-1",
      )}
    >
      {/* Horizontal feature row */}
      <div
        className={cn(
          "relative flex items-start gap-5 p-6 rounded-2xl transition-all duration-300",
          "hover:bg-white/3",
          isLarge && "lg:flex-row lg:items-center",
        )}
      >
        {/* Left accent line */}
        <div
          className={cn(
            "absolute left-0 top-6 bottom-6 w-0.5 rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300",
            feature.accentBg,
          )}
        />

        {/* Icon */}
        <div className="relative shrink-0 ml-4">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              "bg-white/4 group-hover:bg-white/8",
            )}
          >
            <feature.icon
              className={cn(
                "h-6 w-6 transition-colors duration-300",
                "text-muted-foreground group-hover:" +
                  feature.iconColor.replace("text-", "text-"),
              )}
              style={{}}
            />
          </div>
          {/* Glow behind icon on hover */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
              feature.accentBg,
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("text-base lg:text-xl font-semibold transition-colors duration-300", feature.titleHoverColor)}>
              {feature.title}
            </h3>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="mx-6 h-px bg-white/4 group-last:hidden" />
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="relative py-2">
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6"
          >
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">
              Platform Features
            </span>
          </motion.div> */}

          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Excel
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A complete learning ecosystem designed to help you master
            mathematics and achieve your academic goals.
          </p>
        </motion.div>

        {/* Features — stacked rows with accent lines */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {features.map((feature, idx) => (
              <FeatureItem key={idx} feature={feature} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
