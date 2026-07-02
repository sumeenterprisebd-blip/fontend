import { useState } from "react";
import { uploadAPI } from "@/services/api";

export default function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (onSuccess, folder = "drip_drop/campaigns") => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          setError("Image size should be less than 5MB");
          return;
        }

        setUploading(true);
        setError(null);

        try {
          // Always use backend-signed uploads for security
          // This prevents exposing API keys on the frontend
          const signatureResponse = await uploadAPI.getSignature(folder);

          if (
            !signatureResponse.data.success ||
            !signatureResponse.data.configured
          ) {
            throw new Error("Cloudinary is not configured");
          }

          const {
            signature,
            timestamp,
            cloudName: backendCloudName,
            apiKey,
            folder: backendFolder,
          } = signatureResponse.data;

          const uploadFormData = new FormData();
          uploadFormData.append("file", file);
          uploadFormData.append("timestamp", timestamp.toString());
          uploadFormData.append("signature", signature);
          uploadFormData.append("api_key", apiKey);
          uploadFormData.append("folder", backendFolder);

          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${backendCloudName}/image/upload`,
            {
              method: "POST",
              body: uploadFormData,
            }
          );

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await uploadResponse.json();
          onSuccess(data.secure_url);
        } catch (err) {
          setError("Failed to upload image");
        } finally {
          setUploading(false);
        }
      };

      input.click();
    } catch (err) {
    }
  };

  return { uploading, error, uploadImage };
}
