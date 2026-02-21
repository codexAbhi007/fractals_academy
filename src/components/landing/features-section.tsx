"use client";

import { AnimatedCard } from "@/components/ui/aceternity";
import {
  BookOpen,
  Brain,
  ChartLine,
  GraduationCap,
  Users,
  Video,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Class 7-12 Mathematics",
    description:
      "Comprehensive curriculum covering CBSE, ICSE, and State Board syllabi with in-depth problem-solving techniques.",
  },
  {
    icon: Brain,
    title: "JEE & WBJEE Prep",
    description:
      "Focused preparation for engineering entrance exams with advanced problem sets and exam strategies.",
  },
  {
    icon: Video,
    title: "Video Lectures",
    description:
      "Access recorded lessons anytime. Learn at your own pace with detailed explanations.",
  },
  {
    icon: BookOpen,
    title: "Question Bank",
    description:
      "Extensive practice problems with LaTeX-rendered solutions organized by topic and difficulty.",
  },
  {
    icon: ChartLine,
    title: "Progress Tracking",
    description:
      "Detailed analytics to identify strengths and weaknesses. Monthly performance reports sent to your email.",
  },
  {
    icon: Users,
    title: "Doubt Resolution",
    description:
      "Direct support from Sayantan Sir. Get your specific questions answered promptly.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-24 bg-linear-to-b from-background to-background/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Excel
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete learning ecosystem designed to help you master
            mathematics and achieve your academic goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <AnimatedCard key={idx} delay={idx * 0.1}>
              <feature.icon className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
