"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface VideoType {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  description?: string;
  classLevel: string;
  subject: string;
  chapter?: string;
  topic?: string;
}

interface VideoCardProps {
  video: VideoType;
  index: number;
}

function VideoCard({ video, index }: VideoCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const handleClick = () => {
    window.open(`https://youtube.com/watch?v=${video.youtubeId}`, "_blank");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:border-white/20 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        {/* Class badge */}
        <div className="absolute top-2 left-2 bg-purple-500/80 text-white text-xs px-2 py-1 rounded">
          Class {video.classLevel}
        </div>
        {/* Subject badge */}
        <div className="absolute top-2 right-2 bg-pink-500/80 text-white text-xs px-2 py-1 rounded capitalize">
          {video.subject.toLowerCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {video.title}
        </h3>
        {video.chapter && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {video.chapter}
            {video.topic && ` • ${video.topic}`}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function LatestVideosSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos/recommended?limit=6");
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <section
      id="videos"
      ref={ref}
      className="relative py-24 bg-gradient-to-b from-background/50 to-background"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Video Lectures
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access our library of recorded lessons. Sign up to unlock the
            complete video archive and track your progress.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : error || videos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No videos available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {videos.map((video, idx) => (
              <VideoCard key={video.id} video={video} index={idx} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/signup">
            <Button
              variant="outline"
              className="rounded-full border-white/20 hover:bg-white/5 cursor-pointer"
            >
              View All Videos →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
