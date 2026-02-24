"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  if (value) {
    return (
      <div className="relative w-full max-w-md">
        <div className="relative w-full rounded-lg border border-white/10 overflow-hidden bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Question image"
            className="w-full h-auto max-h-[300px] object-contain"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-8 w-8 rounded-full z-10"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isUploading && (
        <div className="flex flex-col items-center justify-center p-8 border border-white/10 rounded-lg bg-white/5 mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-2" />
          <p className="text-sm text-muted-foreground">Uploading image...</p>
        </div>
      )}
      <UploadDropzone
        endpoint="questionImage"
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          if (res?.[0]) {
            const fileData = res[0];
            // UploadThing v7 returns ufsUrl for the new URL format
            const url = fileData.ufsUrl || fileData.url;
            if (url) {
              onChange(url);
              toast.success("Image uploaded successfully!");
            }
          }
        }}
        onUploadError={(error) => {
          setIsUploading(false);
          toast.error(error.message || "Failed to upload image");
        }}
      />
    </div>
  );
}
