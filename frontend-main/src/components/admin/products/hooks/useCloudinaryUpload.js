import { useState, useEffect } from "react";
import { useUploadConfig, waitForCloudinary } from "./cloudinaryHelpers";

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { getUploadConfig } = useUploadConfig();

  useEffect(() => {
    // Ensure Cloudinary script is loaded
    if (typeof window !== "undefined" && !window.cloudinary) {
      const existingScript = document.querySelector(
        'script[src*="upload-widget.cloudinary.com"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.type = "text/javascript";
        script.async = true;
        script.onerror = () => setError("Failed to load Cloudinary widget script. Please check your network or ad blocker.");
        document.head.appendChild(script);
      }
    }
  }, []);

  const uploadImage = async (onSuccess, options = {}) => {
    try {
      setUploading(true);
      setError("");

      const cloudinaryLoaded = await waitForCloudinary();
      if (!cloudinaryLoaded || !window.cloudinary?.createUploadWidget) {
        throw new Error(
          "Cloudinary widget not loaded. Please refresh the page."
        );
      }

      // Determine folder based on options or default to products
      const folder = options.folder || "drip_drop/products";

      const config = await getUploadConfig(folder);

      const widgetConfig = {
        cloudName: config.cloudName,
        cropping: true,
        multiple: false,
        maxFiles: 1,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 5000000,
      };

      if (config.useUnsigned) {
        widgetConfig.uploadPreset = config.uploadPreset;
        widgetConfig.folder = folder;
      } else {
        widgetConfig.uploadSignature = config.signature;
        widgetConfig.uploadSignatureTimestamp = config.timestamp;
        widgetConfig.apiKey = config.apiKey;
        widgetConfig.folder = config.folder;
      }

      const widget = window.cloudinary.createUploadWidget(
        widgetConfig,
        (error, result) => {
          setUploading(false);

          if (error) {
            const isSignatureError =
              error.statusText?.includes("Invalid Signature");
            if (isSignatureError) {
              setError(
                "Invalid signature error. Please use unsigned uploads by setting NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
              );
            } else {
              setError(error.message || "Image upload failed");
            }
            return;
          }

          if (result?.event === "success") {
            onSuccess(result.info.secure_url);
            setError("");
          }
        }
      );

      setTimeout(() => {
        widget.open();
      }, 100);
    } catch (err) {
      setUploading(false);
      if (err.message === "CLOUDINARY_PLACEHOLDER") {
        setError(
          'Please replace "your_cloud_name_here" with your actual Cloudinary cloud name in .env.local file'
        );
      } else if (err.message === "CLOUDINARY_NOT_CONFIGURED") {
        setError(
          "Cloudinary is not configured. Please set up NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local file"
        );
      } else {
        setError(err.message || "Failed to initialize upload");
      }
    }
  };

  return {
    uploading,
    error,
    uploadImage,
  };
};
