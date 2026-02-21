import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { video } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Plus, ExternalLink, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteVideoButton } from "./delete-video-button";

async function getVideos() {
  return await db.select().from(video).orderBy(desc(video.createdAt));
}

export default async function AdminVideosPage() {
  const videos = await getVideos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Library</h1>
          <p className="text-muted-foreground">
            Manage your YouTube video lectures
          </p>
        </div>
        <Link href="/admin/videos/new">
          <Button className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No videos uploaded yet</p>
            <Link href="/admin/videos/new">
              <Button variant="outline" className="border-white/10">
                <Plus className="h-4 w-4 mr-2" />
                Upload your first video
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((vid) => (
            <Card
              key={vid.id}
              className="border-white/10 bg-white/5 overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={vid.thumbnail}
                  alt={vid.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="bg-purple-500/80 text-white text-xs px-2 py-1 rounded">
                    Class {vid.classLevel}
                  </span>
                  <span className="bg-pink-500/80 text-white text-xs px-2 py-1 rounded capitalize">
                    {vid.subject.toLowerCase()}
                  </span>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-2">
                  {vid.title}
                </CardTitle>
                {(vid.chapter || vid.topic) && (
                  <CardDescription className="text-xs">
                    {vid.chapter && <span>{vid.chapter}</span>}
                    {vid.chapter && vid.topic && <span> • </span>}
                    {vid.topic && <span>{vid.topic}</span>}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <a
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on YouTube
                  </a>
                  <div className="flex-1" />
                  <Link href={`/admin/videos/${vid.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteVideoButton videoId={vid.id} videoTitle={vid.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
