"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useImageKitUpload } from "@/hooks/use-imagekit-upload";
import { validateFile } from "@/lib/imagekit/config";
import { Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";

export function ImageKitUploader({
  onUploadComplete,
  onUploadError,
  folder = "uploads",
  acceptImages = true,
  acceptVideos = false,
  maxSizeMB = 5,
  buttonText = "Upload Media",
  showPreview = true,
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const { upload, uploading, progress, error, reset } = useImageKitUpload();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      if (onUploadError) onUploadError(validation.error);
      return;
    }

    // Create preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setFileType(validation.isImage ? "image" : "video");
      };
      reader.readAsDataURL(file);
    }

    // Start upload
    try {
      const result = await upload(file, folder);
      toast.success("Upload successful!");
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      toast.error(error || "Upload failed");
      if (onUploadError) {
        onUploadError(err.message);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileType(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const acceptTypes = [];
  if (acceptImages) acceptTypes.push("image/*");
  if (acceptVideos) acceptTypes.push("video/*");

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {!preview && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes.join(",")}
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-dashed border-2 h-24 hover:bg-muted/50"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {buttonText}
              </span>
              <span className="text-xs text-muted-foreground">
                {acceptImages && acceptVideos
                  ? "Images or Videos"
                  : acceptImages
                  ? "Images only"
                  : "Videos only"}{" "}
                (Max {maxSizeMB}MB)
              </span>
            </div>
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Preview */}
      {preview && !uploading && (
        <div className="relative rounded-lg overflow-hidden border border-cyber-border">
          {fileType === "image" ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain bg-cyber-darker"
            />
          ) : (
            <video
              src={preview}
              controls
              className="w-full h-auto max-h-96 bg-cyber-darker"
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
          {fileType === "image" ? (
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-xs text-white">
              <ImageIcon className="w-3 h-3" />
              Image
            </div>
          ) : (
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-xs text-white">
              <Video className="w-3 h-3" />
              Video
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && !uploading && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
