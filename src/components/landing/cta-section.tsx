"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  HoverBorderGradient,
  BackgroundBeams,
} from "@/components/ui/aceternity";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <BackgroundBeams />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Transform
            </span>{" "}
            Your Math Journey?
          </h2>

          <p className="text-lg text-muted-foreground mb-10">
            Join hundreds of students who have already improved their
            mathematical skills with Fractals Academy. Start your journey today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <HoverBorderGradient className="text-base">
                <span className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </span>
              </HoverBorderGradient>
            </Link>

            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us →
            </Link>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Instant Access
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Cancel Anytime
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
