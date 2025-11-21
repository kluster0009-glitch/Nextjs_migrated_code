"use client";

import { imagekitConfig, validateFile } from "./config";

/**
 * Upload file to ImageKit with progress tracking
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @param {string} folder - Folder path in ImageKit
 * @param {string} fileName - Custom file name (optional)
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadToImageKit = async (
  file,
  onProgress,
  folder = "uploads",
  fileName = null
) => {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    // Get authentication parameters from our API
    const authResponse = await fetch("/api/imagekit/auth");
    if (!authResponse.ok) {
      throw new Error("Failed to get authentication parameters");
    }

    const authData = await authResponse.json();

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicKey", imagekitConfig.publicKey);
    formData.append("signature", authData.signature);
    formData.append("expire", authData.expire);
    formData.append("token", authData.token);
    formData.append("folder", folder);

    // Use custom filename or generate one
    const customFileName =
      fileName || `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    formData.append("fileName", customFileName);

    // Upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });

      // Handle completion
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              url: response.url,
              fileId: response.fileId,
              name: response.name,
              filePath: response.filePath,
              thumbnailUrl: response.thumbnailUrl,
              width: response.width,
              height: response.height,
              size: response.size,
            });
          } catch (error) {
            reject(new Error("Failed to parse upload response"));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      // Send request
      xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
      xhr.send(formData);

      // Return xhr for cancellation
      xhr.cancel = () => xhr.abort();
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};

/**
 * Delete file from ImageKit
 * @param {string} fileId - ImageKit file ID
 */
export const deleteFromImageKit = async (fileId) => {
  try {
    const response = await fetch("/api/imagekit/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete file");
    }

    return await response.json();
  } catch (error) {
    console.error("ImageKit delete error:", error);
    throw error;
  }
};

/**
 * Generate optimized image URL with transformations
 * @param {string} url - Original ImageKit URL
 * @param {Object} transformations - Transformation options
 */
export const getOptimizedUrl = (url, transformations = {}) => {
  if (!url) return "";

  const {
    width,
    height,
    quality = 80,
    format = "auto",
    crop = "maintain_ratio",
  } = transformations;

  const params = [];

  if (width) params.push(`w-${width}`);
  if (height) params.push(`h-${height}`);
  if (quality) params.push(`q-${quality}`);
  if (format) params.push(`f-${format}`);
  if (crop) params.push(`c-${crop}`);

  if (params.length === 0) return url;

  // Insert transformations in ImageKit URL
  const transformStr = `tr:${params.join(",")}`;
  return url.replace(
    imagekitConfig.urlEndpoint,
    `${imagekitConfig.urlEndpoint}/${transformStr}`
  );
};
