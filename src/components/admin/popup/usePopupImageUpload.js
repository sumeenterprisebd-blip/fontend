import { useState } from "react";

export default function usePopupImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (file) => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select an image file");
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size should be less than 5MB");
    }

    setUploading(true);
    setError("");

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
        "drip_drop_unsigned";

      if (!cloudName) {
        throw new Error(
          "Cloudinary is not configured. Please contact administrator."
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "drip_drop/popups");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      if (!data.secure_url) {
        throw new Error("No secure URL returned from upload");
      }

      return data.secure_url;
    } catch (err) {
      setError(err.message || "Failed to upload image. Please try again.");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error, setError };
}
