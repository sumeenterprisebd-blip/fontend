import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";

export default function useLogoUpload(settings, onChange) {
  const { uploadLogo } = useSettings();
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: "", text: "" });
  const [logoPreview, setLogoPreview] = useState(settings.logo);

  const validateFile = (file) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Please upload a valid image file (PNG, JPG, WEBP, or SVG). You uploaded: ${
          file.type || "unknown type"
        }`,
      };
    }

    if (file.size > 2 * 1024 * 1024) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      return {
        valid: false,
        error: `Image size must be less than 2MB. Your file is ${sizeMB}MB`,
      };
    }

    return { valid: true };
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadMessage({ type: "error", text: validation.error });
      return;
    }

    setUploading(true);
    setUploadMessage({ type: "", text: "" });

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        const result = await uploadLogo(base64String);

        if (result.success) {
          setLogoPreview(result.logoUrl);
          onChange("logo", result.logoUrl);
          setUploadMessage({
            type: "success",
            text: 'Logo uploaded successfully! Click "Save Changes" to apply.',
          });
          setTimeout(() => setUploadMessage({ type: "", text: "" }), 5000);
        } else {
          setUploadMessage({
            type: "error",
            text: result.message || "Failed to upload logo",
          });
        }
        setUploading(false);
      };

      reader.onerror = () => {
        setUploadMessage({ type: "error", text: "Failed to read file" });
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setUploadMessage({
        type: "error",
        text: "An error occurred while uploading",
      });
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview("/logo.jpeg");
    onChange("logo", "/logo.jpeg");
  };

  return {
    logoPreview,
    setLogoPreview,
    uploading,
    uploadMessage,
    handleLogoUpload,
    handleRemoveLogo,
  };
}
