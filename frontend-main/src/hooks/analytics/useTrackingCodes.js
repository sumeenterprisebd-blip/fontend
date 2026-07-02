import { useState, useEffect } from "react";
import { settingsAPI } from "@/services/api";

const extractGtmId = (input) => {
  const text = String(input || "").trim();
  if (!text) return "";
  const match = text.toUpperCase().match(/GTM-[A-Z0-9]+/);
  return match ? match[0] : "";
};

const extractFacebookPixelId = (input) => {
  const text = String(input || "").trim();
  if (!text) return "";
  const initMatch = text.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d{5,20})['"]\s*\)/i);
  if (initMatch) return initMatch[1];
  const digitsMatch = text.match(/\b(\d{5,20})\b/);
  return digitsMatch ? digitsMatch[1] : "";
};

const extractGaMeasurementId = (input) => {
  const text = String(input || "").trim();
  if (!text) return "";
  const match = text.toUpperCase().match(/\bG-[A-Z0-9]{6,20}\b/);
  return match ? match[0] : "";
};

const extractClarityProjectId = (input) => {
  const text = String(input || "").trim();
  if (!text) return "";
  const urlMatch = text.match(/clarity\.ms\/tag\/(\w{5,40})/i);
  if (urlMatch) return urlMatch[1];
  const idMatch = text.match(/\b(\w{5,40})\b/);
  return idMatch ? idMatch[1] : "";
};

const validateTrackingCodes = (codes) => {
  const errors = {};
  const normalized = {
    gtmId: "",
    facebookPixelId: "",
    googleAnalyticsMeasurementId: "",
    microsoftClarityProjectId: "",
  };

  const rawGtm = String(codes?.gtmId || "").trim();
  if (rawGtm) {
    const extracted = extractGtmId(rawGtm);
    if (!extracted) {
      errors.gtmId = "Invalid GTM code. Use GTM-XXXXXXX or paste the official GTM snippet.";
      normalized.gtmId = rawGtm;
    } else {
      normalized.gtmId = extracted;
    }
  }

  const rawPixel = String(codes?.facebookPixelId || "").trim();
  if (rawPixel) {
    const extracted = extractFacebookPixelId(rawPixel);
    if (!extracted) {
      errors.facebookPixelId = "Invalid Facebook Pixel ID. Paste the Pixel ID or full Pixel snippet.";
      normalized.facebookPixelId = rawPixel;
    } else {
      normalized.facebookPixelId = extracted;
    }
  }

  const rawGa = String(codes?.googleAnalyticsMeasurementId || "").trim();
  if (rawGa) {
    const extracted = extractGaMeasurementId(rawGa);
    if (!extracted) {
      errors.googleAnalyticsMeasurementId = "Invalid GA4 Measurement ID. Use G-XXXXXXXXXX or paste the GA snippet.";
      normalized.googleAnalyticsMeasurementId = rawGa;
    } else {
      normalized.googleAnalyticsMeasurementId = extracted;
    }
  }

  const rawClarity = String(codes?.microsoftClarityProjectId || "").trim();
  if (rawClarity) {
    const extracted = extractClarityProjectId(rawClarity);
    if (!extracted) {
      errors.microsoftClarityProjectId = "Invalid Clarity Project ID. Paste the Project ID or full Clarity snippet.";
      normalized.microsoftClarityProjectId = rawClarity;
    } else {
      normalized.microsoftClarityProjectId = extracted;
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors, normalized };
};

/**
 * Custom hook for managing tracking codes
 * Handles localStorage persistence
 */
const useTrackingCodes = () => {
  const [trackingCodes, setTrackingCodes] = useState({
    gtmId: "",
    facebookPixelId: "",
    googleAnalyticsMeasurementId: "",
    microsoftClarityProjectId: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch tracking codes from backend settings.
    // Use shared axios client so Authorization header (if present) is applied consistently.
    const fetchCodes = async () => {
      try {
        const res = await settingsAPI.getSettingsFresh();
        const settings = res?.data?.settings || {};
        setTrackingCodes({
          gtmId: settings.gtmId || "",
          facebookPixelId: settings.facebookPixelId || "",
          googleAnalyticsMeasurementId: settings.googleAnalyticsMeasurementId || "",
          microsoftClarityProjectId: settings.microsoftClarityProjectId || "",
        });
      } catch (err) {
        // Fallback to localStorage only if backend fetch fails
        const savedCodes = {
          gtmId: typeof window !== "undefined" ? localStorage.getItem("admin_gtm_id") || "" : "",
          facebookPixelId: typeof window !== "undefined" ? localStorage.getItem("admin_fb_pixel_id") || "" : "",
          googleAnalyticsMeasurementId: typeof window !== "undefined" ? localStorage.getItem("admin_ga_measurement_id") || "" : "",
          microsoftClarityProjectId: typeof window !== "undefined" ? localStorage.getItem("admin_clarity_project_id") || "" : "",
        };
        setTrackingCodes(savedCodes);
      }
    };
    fetchCodes();
  }, []);

  const handleChange = (field, value) => {
    setTrackingCodes((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async () => {
    const validation = validateTrackingCodes(trackingCodes);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    const normalizedPayload = validation.normalized;

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      // Save to backend settings (DB persistence)
      await settingsAPI.updateSettings({
        gtmId: normalizedPayload.gtmId || "",
        facebookPixelId: normalizedPayload.facebookPixelId || "",
        googleAnalyticsMeasurementId: normalizedPayload.googleAnalyticsMeasurementId || "",
        microsoftClarityProjectId: normalizedPayload.microsoftClarityProjectId || "",
      });

      // Re-fetch from DB as source of truth to avoid stale/edge cache values.
      const fresh = await settingsAPI.getSettingsFresh();
      const updated = fresh?.data?.settings || {};
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_gtm_id", normalizedPayload.gtmId || "");
        localStorage.setItem("admin_fb_pixel_id", normalizedPayload.facebookPixelId || "");
        localStorage.setItem("admin_ga_measurement_id", normalizedPayload.googleAnalyticsMeasurementId || "");
        localStorage.setItem("admin_clarity_project_id", normalizedPayload.microsoftClarityProjectId || "");

        // Keep storefront settings cache in sync so tracking scripts load immediately
        // when switching from admin -> public pages (and across tabs/browsers).
        try {
          const existing = localStorage.getItem("siteSettings");
          const parsed = existing ? JSON.parse(existing) : {};
          const next = {
            ...(parsed && typeof parsed === "object" ? parsed : {}),
            gtmId: updated.gtmId ?? normalizedPayload.gtmId ?? "",
            facebookPixelId: updated.facebookPixelId ?? normalizedPayload.facebookPixelId ?? "",
            googleAnalyticsMeasurementId:
              updated.googleAnalyticsMeasurementId ??
              normalizedPayload.googleAnalyticsMeasurementId ??
              "",
            microsoftClarityProjectId:
              updated.microsoftClarityProjectId ??
              normalizedPayload.microsoftClarityProjectId ??
              "",
          };
          localStorage.setItem("siteSettings", JSON.stringify(next));
          localStorage.setItem("siteSettingsTime", Date.now().toString());
          window.dispatchEvent(new Event("siteSettingsUpdated"));
        } catch {
          // ignore
        }
      }

      setTrackingCodes((prev) => ({
        ...prev,
        gtmId: updated.gtmId ?? normalizedPayload.gtmId ?? "",
        facebookPixelId: updated.facebookPixelId ?? normalizedPayload.facebookPixelId ?? "",
        googleAnalyticsMeasurementId:
          updated.googleAnalyticsMeasurementId ??
          normalizedPayload.googleAnalyticsMeasurementId ??
          "",
        microsoftClarityProjectId:
          updated.microsoftClarityProjectId ?? normalizedPayload.microsoftClarityProjectId ?? "",
      }));
      setMessage({
        type: "success",
        text: "Tracking codes saved successfully!",
      });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setMessage({ type: "error", text: apiMessage || "Failed to save tracking codes" });
    } finally {
      setSaving(false);
    }
  };

  return {
    trackingCodes,
    saving,
    message,
    errors,
    extractGtmId,
    validateTrackingCodes,
    extractFacebookPixelId,
    extractGaMeasurementId,
    extractClarityProjectId,
    handleChange,
    handleSave,
  };
};

export default useTrackingCodes;
