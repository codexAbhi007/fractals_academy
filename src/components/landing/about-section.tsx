"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Award, Users, BookOpen } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-pulse" />
              <div
                className="absolute inset-4 rounded-full border border-pink-500/20 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute inset-8 rounded-full border border-cyan-500/20 animate-pulse"
                style={{ animationDelay: "1s" }}
              />

              {/* Center content */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                <Image
                  src="/sayantan.jpg"
                  alt="Sayantan Sarcar"
                  fill
                  className="object-cover object-[center_5%]"
                />
              </div>

              {/* Floating badges */}
              {[
                {
                  icon: Award,
                  label: "Expert Mentor",
                  position: "top-0 right-0",
                },
                {
                  icon: Users,
                  label: "500+ Students",
                  position: "bottom-0 right-0",
                },
                {
                  icon: BookOpen,
                  label: "1000+ Lessons",
                  position: "bottom-0 left-0",
                },
              ].map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className={`absolute ${badge.position} bg-background/80 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex items-center gap-2`}
                >
                  <badge.icon className="h-5 w-5 text-purple-400" />
                  <span className="text-xs font-medium">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Fractals Academy
              </span>
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Founded by{" "}
              <strong className="text-foreground">Sayantan Sarcar</strong>,
              Fractals Academy is dedicated to making mathematics accessible and
              enjoyable for students across all levels. With over 6 years of
              teaching experience, we specialize in building strong foundations
              and problem-solving skills.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-purple-400 text-sm">✓</span>
                </div>
                <div>
                  <div className="font-medium">Personalized Learning</div>
                  <div className="text-sm text-muted-foreground">
                    Individual attention to understand each student&apos;s
                    unique learning style
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-pink-400 text-sm">✓</span>
                </div>
                <div>
                  <div className="font-medium">Competitive Exam Focus</div>
                  <div className="text-sm text-muted-foreground">
                    Specialized preparation for JEE Main, JEE Advanced & WBJEE
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-cyan-400 text-sm">✓</span>
                </div>
                <div>
                  <div className="font-medium">Regular Assessments</div>
                  <div className="text-sm text-muted-foreground">
                    Weekly tests and detailed performance analysis
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                144, Baruipur, Kolkata, West Bengal
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
