// ImageKit configuration
export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
};

// Validate configuration
export const validateImageKitConfig = () => {
  if (!imagekitConfig.publicKey) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is not defined");
  }
  if (!imagekitConfig.urlEndpoint) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined");
  }
  return true;
};

// File type validation
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
];

// File size limits (in bytes)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Helper functions
export const isImageFile = (type) => ALLOWED_IMAGE_TYPES.includes(type);
export const isVideoFile = (type) => ALLOWED_VIDEO_TYPES.includes(type);

export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload an image or video file.",
    };
  }

  const isImage = isImageFile(file.type);
  const isVideo = isVideoFile(file.type);
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true, isImage, isVideo };
};
