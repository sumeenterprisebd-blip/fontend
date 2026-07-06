import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { useRouter } from "next/router";
import { scheduleWork } from "@/utils/scheduleWork";

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  siteName: "Sume Traders",
  logo: "/logo.jpeg",
  favicon: "/logo.jpeg",
  tagline: "Your Premium Fashion Destination",
  email: "support@sumetraders.com",
  phone: "+01835847678",
  address: "",
  gtmId: "",
  facebookPixelId: "",
  googleAnalyticsMeasurementId: "",
  microsoftClarityProjectId: "",
  socialMedia: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  },
  currency: "BDT",
};

const readCachedSettings = () => {
  if (typeof window === "undefined") return null;
  try {
    const cachedSettings = localStorage.getItem("siteSettings");
    const cacheTime = localStorage.getItem("siteSettingsTime");
    if (!cachedSettings || !cacheTime) return null;

    const fiveMinutes = 5 * 60 * 1000;
    const isValid = Date.now() - parseInt(cacheTime, 10) < fiveMinutes;
    if (!isValid) return null;

    const parsed = JSON.parse(cachedSettings);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const router = useRouter();

  // Initialize from cache on the client to avoid an extra post-mount re-render
  // (reduces main-thread work + style/layout churn on the homepage).
  const [settings, setSettings] = useState(() => readCachedSettings() || DEFAULT_SETTINGS);

  // Keep loading false by default for non-admin routes. Admin pages can opt into
  // showing loading state while fetching.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch settings on mount
  useEffect(() => {
    const path = router.pathname || "";
    const needsImmediateSettings = path.startsWith("/admin");

    const cached = !needsImmediateSettings ? readCachedSettings() : null;

    const run = () => {
      fetchSettings({ setLoadingState: needsImmediateSettings });
    };

    // On storefront routes, use cache for initial render but still revalidate in the background.
    // This ensures tracking IDs (and other settings) update quickly across devices/browsers
    // after an admin saves changes.
    const runBackgroundRevalidate = () => {
      fetchSettings({ setLoadingState: false, forceNetwork: true });
    };

    if (needsImmediateSettings) {
      run();
      return;
    }

    // New devices/browsers won't have localStorage cached settings.
    // Fetch immediately so tracking IDs (especially Facebook Pixel) can be injected early
    // and detected by third-party verification tools.
    if (!cached) {
      run();
      return;
    }

    // Defer non-critical settings fetch to idle time to reduce TBT.
    // Defaults/cached settings are used for initial render.
    if (typeof window !== "undefined" && document?.readyState !== "complete") {
      const onLoad = () => scheduleWork(run, { timeout: 8000 });
      window.addEventListener("load", onLoad, { once: true });

      // If we have a cached value, still revalidate shortly after load.
      if (cached) {
        const onLoadRevalidate = () => scheduleWork(runBackgroundRevalidate, { timeout: 12000 });
        window.addEventListener("load", onLoadRevalidate, { once: true });
        return () => {
          window.removeEventListener("load", onLoad);
          window.removeEventListener("load", onLoadRevalidate);
        };
      }

      return () => window.removeEventListener("load", onLoad);
    }

    scheduleWork(run, { timeout: 8000 });

    // If cache exists, revalidate in background soon.
    if (cached) {
      scheduleWork(runBackgroundRevalidate, { timeout: 12000 });
    }
  }, [router.pathname]);

  const fetchSettings = async ({ setLoadingState = true, forceNetwork = false } = {}) => {
    try {
      // Check if cached settings exist and are less than 5 minutes old
      const cached = !forceNetwork ? readCachedSettings() : null;
      if (cached) {
        // Validate cached logo URL before using
        if (cached.logo && cached.logo.includes("http://localhost") && typeof window !== "undefined") {
          // Check if the image exists by attempting to load it
          const img = new window.Image();
          img.onerror = () => {
            cached.logo = "/logo.jpeg";
            setSettings(cached);
          };
          img.onload = () => {
            setSettings(cached);
          };
          img.src = cached.logo;
        } else {
          setSettings(cached);
        }

        setError(null);
        return;
      }

      if (setLoadingState) setLoading(true);

      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "GET",
        credentials: "omit",
        // Avoid stale browser/proxy caching for settings (especially tracking IDs).
        // We still do localStorage caching to keep performance characteristics.
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      if (data.success) {
        const fetchedSettings = data.settings;

        // Validate logo URL before caching
        if (
          fetchedSettings.logo &&
          fetchedSettings.logo.includes("http://localhost")
        ) {
          // Test if the image exists
          try {
            const imgCheck = await fetch(fetchedSettings.logo, {
              method: "HEAD",
            });
            if (!imgCheck.ok) {
              // If image doesn't exist, use default
              fetchedSettings.logo = "/logo.jpeg";
            }
          } catch (e) {
            // If fetch fails, use default logo (silently)
            fetchedSettings.logo = "/logo.jpeg";
          }
        }

        setSettings(fetchedSettings);

        // Cache the validated settings
        if (typeof window !== "undefined") {
          localStorage.setItem("siteSettings", JSON.stringify(fetchedSettings));
          localStorage.setItem("siteSettingsTime", Date.now().toString());
        }
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      // Keep default settings if fetch fails
    } finally {
      if (setLoadingState) setLoading(false);
    }
  };

  // Sync settings updates across same-tab (custom event) and other tabs (storage event).
  // This is important for tracking-code changes: after admin saves, storefront pages
  // should pick up new IDs quickly without requiring manual cache clearing.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyCachedAndRevalidate = () => {
      try {
        const cached = readCachedSettings();
        if (cached) {
          setSettings(cached);
        }
      } catch {
        // ignore
      }

      scheduleWork(() => {
        fetchSettings({ setLoadingState: false, forceNetwork: true });
      }, { timeout: 2000 });
    };

    const onCustom = () => applyCachedAndRevalidate();
    const onStorage = (e) => {
      const key = e?.key;
      if (key === "siteSettings" || key === "siteSettingsTime") {
        applyCachedAndRevalidate();
      }
    };

    window.addEventListener("siteSettingsUpdated", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("siteSettingsUpdated", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "omit",
        body: JSON.stringify(newSettings),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setSettings(data.settings);

        // Update cache
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "siteSettings",
            JSON.stringify(data.settings)
          );
          localStorage.setItem("siteSettingsTime", Date.now().toString());
        }

        return { success: true, message: "Settings updated successfully" };
      }

      return {
        success: false,
        message: data?.message || "Failed to update settings",
      };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Failed to update settings",
      };
    }
  };

  const uploadLogo = async (imageData) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        return {
          success: false,
          message: "Authentication required. Please log in as admin.",
        };
      }

      const res = await fetch(`${API_BASE_URL}/settings/logo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "omit",
        body: JSON.stringify({ imageData }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        // Update logo in settings immediately
        setSettings((prev) => ({
          ...prev,
          logo: data.logoUrl,
        }));

        return { success: true, logoUrl: data.logoUrl };
      } else {
        return {
          success: false,
          message: data?.message || "Upload failed",
        };
      }
    } catch (err) {
      return {
        success: false,
        message:
          err.message || "Failed to upload logo",
      };
    }
  };

  const refreshSettings = () => {
    fetchSettings();
  };

  const value = {
    settings,
    loading,
    error,
    updateSettings,
    uploadLogo,
    refreshSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
