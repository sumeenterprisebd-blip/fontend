import { useState } from "react";
import { uploadAPI } from "@/services/api";
import { validateFile } from "@/utils/validation";

/**
 * Custom hook for handling image uploads to Cloudinary
 * Supports both unsigned and signed uploads
 *
 * @param {Object} options - Configuration options
 * @param {string} options.folder - Cloudinary folder path (default: 'drip_drop')
 * @param {number} options.maxSize - Max file size in bytes (default: 5MB)
 * @returns {Object} - Upload state and functions
 */
export const useImageUpload = (options = {}) => {
  const {
    folder = "drip_drop",
    maxSize = 5 * 1024 * 1024, // 5MB
  } = options;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Upload image to Cloudinary
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} - Uploaded image URL
   */
  const uploadImage = async (file) => {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file
    const validationError = validateFile(file, {
      maxSize,
      allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
      allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    });

    if (validationError) {
      throw new Error(validationError);
    }

    setUploading(true);
    setError(null);

    try {
      // Try unsigned upload first (recommended)
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (cloudName && uploadPreset) {
        return await uploadUnsigned(file, cloudName, uploadPreset, folder);
      }

      // Fallback to signed upload
      return await uploadSigned(file, folder);
    } catch (err) {
      const errorMessage = getUploadError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Unsigned upload using upload preset
   */
  const uploadUnsigned = async (file, cloudName, uploadPreset, folderPath) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folderPath);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed. Please try again.");
    }

    const data = await response.json();
    return data.secure_url;
  };

  /**
   * Signed upload using backend signature
   */
  const uploadSigned = async (file, folderPath) => {
    const signatureResponse = await uploadAPI.getSignature(folderPath);

    if (!signatureResponse.data.success || !signatureResponse.data.configured) {
      throw new Error(
        "Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local file."
      );
    }

    const { signature, timestamp, cloudName, apiKey } = signatureResponse.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    formData.append("folder", folderPath);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed. Please try again.");
    }

    const data = await response.json();
    return data.secure_url;
  };

  /**
   * Get user-friendly error message
   */
  const getUploadError = (err) => {
    if (err.response?.status === 400) {
      return "Upload failed. Please check file format and size.";
    }
    if (err.response?.status === 401) {
      return "Authentication failed. Please check Cloudinary configuration.";
    }
    if (err.message) {
      return err.message;
    }
    return "Failed to upload image. Please try again.";
  };

  /**
   * Create file input and handle upload
   */
  const triggerUpload = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        try {
          const file = e.target.files[0];
          if (!file) {
            reject(new Error("No file selected"));
            return;
          }

          const imageUrl = await uploadImage(file);
          resolve(imageUrl);
        } catch (err) {
          reject(err);
        }
      };

      input.click();
    });
  };

  return {
    uploading,
    error,
    uploadImage,
    triggerUpload,
  };
};
