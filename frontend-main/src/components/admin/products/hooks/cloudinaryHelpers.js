import { useState } from "react";
import { uploadAPI } from "@/services/api";

export const useUploadConfig = () => {
  const getUploadConfig = async (folder = "drip_drop/products") => {
    // Check for unsigned upload first (preferred)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "drip_drop_unsigned";

    const isPlaceholder =
      cloudName &&
      (cloudName.includes("your_cloud_name") ||
        cloudName.includes("your_cloud_name_here") ||
        cloudName.trim() === "" ||
        cloudName.length < 3);

    if (isPlaceholder) {
      throw new Error("CLOUDINARY_PLACEHOLDER");
    }

    if (cloudName && uploadPreset) {
      return {
        useUnsigned: true,
        cloudName,
        uploadPreset,
      };
    }

    // Try signed upload from backend
    try {
      const response = await uploadAPI.getSignature(folder);
      if (response.data.success && response.data.cloudName) {
        return {
          useUnsigned: false,
          cloudName: response.data.cloudName,
          signature: response.data.signature,
          timestamp: response.data.timestamp,
          apiKey: response.data.apiKey,
          folder: response.data.folder,
        };
      }
    } catch (err) {
      // Backend signature not available
    }

    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  };

  return { getUploadConfig };
};

export const waitForCloudinary = async (maxAttempts = 50) => {
  let attempts = 0;
  while (!window.cloudinary && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
  return !!window.cloudinary;
};
