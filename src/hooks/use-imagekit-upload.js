"use client";

import { useState, useCallback } from "react";
import { uploadToImageKit } from "@/lib/imagekit/upload";

/**
 * Custom hook for uploading files to ImageKit with progress tracking
 */
export const useImageKitUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const upload = useCallback(async (file, folder = "uploads", fileName = null) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setUploadedFile(null);

    try {
      const result = await uploadToImageKit(
        file,
        (progressPercent) => {
          setProgress(progressPercent);
        },
        folder,
        fileName
      );

      setUploadedFile(result);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setUploadedFile(null);
  }, []);

  return {
    upload,
    uploading,
    progress,
    error,
    uploadedFile,
    reset,
  };
};
