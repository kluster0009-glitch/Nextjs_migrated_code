"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useImageKitUpload } from "@/hooks/use-imagekit-upload";
import { validateFile } from "@/lib/imagekit/config";
import { Upload, X, Image as ImageIcon, Video, Plus } from "lucide-react";
import { toast } from "sonner";

/**
 * Multi-file uploader for Instagram-style posts
 * Supports multiple images and videos
 */
export function MultiMediaUploader({
  onMediaChange,
  maxFiles = 10,
  folder = "posts",
  acceptImages = true,
  acceptVideos = true,
}) {
  const fileInputRef = useRef(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const { upload, uploading, progress } = useImageKitUpload();

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Check max files limit
    if (mediaFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        continue;
      }

      try {
        // Create preview immediately
        const preview = await createPreview(file);
        const tempMedia = {
          id: `temp-${Date.now()}-${i}`,
          preview,
          type: validation.isImage ? "image" : "video",
          uploading: true,
          progress: 0,
          file,
        };

        setMediaFiles((prev) => [...prev, tempMedia]);
        setUploadingIndex(mediaFiles.length + i);

        // Upload to ImageKit
        const result = await upload(file, folder);

        // Update with uploaded data
        setMediaFiles((prev) =>
          prev.map((m) =>
            m.id === tempMedia.id
              ? {
                  id: result.fileId,
                  url: result.url,
                  type: validation.isImage ? "image" : "video",
                  width: result.width,
                  height: result.height,
                  fileId: result.fileId,
                  uploading: false,
                  preview,
                }
              : m
          )
        );

        setUploadingIndex(null);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        // Remove failed upload
        setMediaFiles((prev) =>
          prev.filter((m) => m.file !== file)
        );
      }
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createPreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (mediaId) => {
    setMediaFiles((prev) => prev.filter((m) => m.id !== mediaId));
  };

  // Update parent component when media changes
  useEffect(() => {
    const uploadedMedia = mediaFiles
      .filter((m) => !m.uploading)
      .map((m) => ({
        url: m.url,
        type: m.type,
        fileId: m.fileId,
        width: m.width,
        height: m.height,
      }));
    
    if (onMediaChange) {
      onMediaChange(uploadedMedia);
    }
  }, [mediaFiles, onMediaChange]);

  const acceptTypes = [];
  if (acceptImages) acceptTypes.push("image/*");
  if (acceptVideos) acceptTypes.push("video/*");

  return (
    <div className="space-y-4">
      {/* Media Grid */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {mediaFiles.map((media, index) => (
            <div
              key={media.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-cyber-border bg-cyber-darker"
            >
              {/* Preview */}
              {media.type === "image" ? (
                <img
                  src={media.preview || media.url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={media.preview || media.url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}

              {/* Upload Progress Overlay */}
              {media.uploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-3/4">
                    <Progress value={progress} className="h-1 mb-2" />
                    <p className="text-xs text-white text-center">
                      {progress}%
                    </p>
                  </div>
                </div>
              )}

              {/* Remove Button */}
              {!media.uploading && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => removeMedia(media.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}

              {/* Type Badge */}
              <div className="absolute bottom-1 left-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] text-white">
                {media.type === "image" ? (
                  <ImageIcon className="w-2.5 h-2.5" />
                ) : (
                  <Video className="w-2.5 h-2.5" />
                )}
                {index + 1}
              </div>
            </div>
          ))}

          {/* Add More Button */}
          {mediaFiles.length < maxFiles && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-cyber-border hover:border-neon-cyan hover:bg-cyber-darker/50 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-neon-cyan"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs">Add More</span>
            </button>
          )}
        </div>
      )}

      {/* Initial Upload Button */}
      {mediaFiles.length === 0 && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes.join(",")}
            className="hidden"
            onChange={handleFileSelect}
            multiple
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-dashed border-2 h-32 hover:bg-muted/50"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                Upload Images or Videos
              </span>
              <span className="text-xs text-muted-foreground">
                Select multiple files (Max {maxFiles})
              </span>
            </div>
          </Button>
        </div>
      )}

      {/* Hidden file input for "Add More" */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes.join(",")}
        className="hidden"
        onChange={handleFileSelect}
        multiple
        disabled={uploading}
      />
    </div>
  );
}
