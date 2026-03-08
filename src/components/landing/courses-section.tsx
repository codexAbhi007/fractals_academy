"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Calculator,
  FlaskConical,
  Trophy,
  Target,
  Star,
  BookOpen,
} from "lucide-react";

interface Course {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
}

const courses: Course[] = [
  {
    title: "Class 7–10 Mathematics & Science",
    subtitle: "Strong foundation for school excellence",
    icon: Calculator,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Class 11–12 Mathematics",
    subtitle: "Board exam mastery across all boards",
    icon: BookOpen,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Class 7–10 JEE Foundation & Olympiad",
    subtitle: "Early preparation for competitive edge",
    icon: Trophy,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Class 11–12 ISI B.Math",
    subtitle: "India's most prestigious math entrance",
    icon: Star,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "JEE Mains & Advanced",
    subtitle: "Complete IIT-JEE preparation",
    icon: Target,
    gradient: "from-red-500 to-rose-500",
  },
  {
    title: "Class 11–12 CUET UG Mathematics",
    subtitle: "Central university entrance preparation",
    icon: GraduationCap,
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    title: "Class 11–12 WBJEE",
    subtitle: "West Bengal engineering entrance",
    icon: FlaskConical,
    gradient: "from-pink-500 to-fuchsia-500",
  },
];

function CourseCard({ course, index }: { course: Course; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative cursor-pointer"
    >
      {/* Gradient border */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          `bg-linear-to-r ${course.gradient}`
        )}
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />

      <div className="relative rounded-xl bg-white/5 p-6 transition-all duration-300 group-hover:-translate-y-1  min-h-[100px]">
        {/* Icon */}
        <div className="mb-4 flex items-center gap-4">
          <div
            className={cn(
              "h-12 w-12 rounded-xl bg-linear-to-br flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
              course.gradient
            )}
          >
            <course.icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-lg lg:text-xl">{course.title}</div>
        </div>


        {/* Subtitle */}
        <p className="text-sm text-muted-foreground">{course.subtitle}</p>
      </div>
    </motion.div>
  );
}

export function CoursesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="courses" ref={ref} className="relative py-2 overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Courses We{" "}
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Offer
            </span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From school mathematics to competitive exam preparation — a
            structured path to academic excellence.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className={cn(
                courses.length % 3 === 1 && idx === courses.length - 1
                  ? "lg:col-start-2"
                  : ""
              )}
            >
              <CourseCard course={course} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}