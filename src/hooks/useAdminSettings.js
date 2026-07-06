import { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";

export function useAdminSettings() {
  const {
    settings: globalSettings,
    updateSettings: updateGlobalSettings,
    loading: loadingSettings,
  } = useSettings();

  const [settings, setSettings] = useState({
    siteName: "Sume Traders",
    logo: "/logo.jpeg",
    siteDescription: "Premium fashion e-commerce platform",
    siteEmail: "admin@sumetraders.com",
    sitePhone: "+01835847678",
    currency: "BDT",
    taxRate: "10",
    shippingFee: "15",
    freeShippingThreshold: "100",
    orderSecurity: {
      enableRiskApproval: true,
      riskApprovalThreshold: "50",
      requireVerifiedForOrders: false,
      requireOtpBeforeOrders: false,
      otpMethod: "none",
      blockSuspiciousUsers: false,
      requireShippingPhoneMatchesAccount: false,
      phoneMinDigits: "10",
      phoneMaxDigits: "15",
      duplicateOrderWindowHours: "6",
      sharedIpWindowHours: "24",
      sharedIpMaxUsers: "3",
      rateWindowMinutes: "10",
      rateMaxInWindow: "3",
      rateDayHours: "24",
      rateMaxPerDay: "20",
    },
  });

  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Sync with global settings when they load
  useEffect(() => {
    if (globalSettings) {
      const os = globalSettings.orderSecurity || {};
      setSettings((prev) => ({
        ...prev,
        siteName: globalSettings.siteName || prev.siteName,
        logo: globalSettings.logo || prev.logo,
        siteEmail: globalSettings.email || prev.siteEmail,
        sitePhone: globalSettings.phone || prev.sitePhone,
        currency: globalSettings.currency || prev.currency,
        shippingFee: String(
          globalSettings.defaultDeliveryFee || prev.shippingFee
        ),
        freeShippingThreshold: String(
          globalSettings.freeShippingThreshold || prev.freeShippingThreshold
        ),
        orderSecurity: {
          ...prev.orderSecurity,
          enableRiskApproval:
            typeof os.enableRiskApproval === "boolean"
              ? os.enableRiskApproval
              : prev.orderSecurity.enableRiskApproval,
          riskApprovalThreshold: String(
            os.riskApprovalThreshold ?? prev.orderSecurity.riskApprovalThreshold
          ),
          requireVerifiedForOrders:
            typeof os.requireVerifiedForOrders === "boolean"
              ? os.requireVerifiedForOrders
              : prev.orderSecurity.requireVerifiedForOrders,
          requireOtpBeforeOrders:
            typeof os.requireOtpBeforeOrders === "boolean"
              ? os.requireOtpBeforeOrders
              : prev.orderSecurity.requireOtpBeforeOrders,
          otpMethod: os.otpMethod || prev.orderSecurity.otpMethod,
          blockSuspiciousUsers:
            typeof os.blockSuspiciousUsers === "boolean"
              ? os.blockSuspiciousUsers
              : prev.orderSecurity.blockSuspiciousUsers,
          requireShippingPhoneMatchesAccount:
            typeof os.requireShippingPhoneMatchesAccount === "boolean"
              ? os.requireShippingPhoneMatchesAccount
              : prev.orderSecurity.requireShippingPhoneMatchesAccount,
          phoneMinDigits: String(os.phoneMinDigits ?? prev.orderSecurity.phoneMinDigits),
          phoneMaxDigits: String(os.phoneMaxDigits ?? prev.orderSecurity.phoneMaxDigits),
          duplicateOrderWindowHours: String(
            os.duplicateOrderWindowHours ?? prev.orderSecurity.duplicateOrderWindowHours
          ),
          sharedIpWindowHours: String(os.sharedIpWindowHours ?? prev.orderSecurity.sharedIpWindowHours),
          sharedIpMaxUsers: String(os.sharedIpMaxUsers ?? prev.orderSecurity.sharedIpMaxUsers),
          rateWindowMinutes: String(os.rateWindowMinutes ?? prev.orderSecurity.rateWindowMinutes),
          rateMaxInWindow: String(os.rateMaxInWindow ?? prev.orderSecurity.rateMaxInWindow),
          rateDayHours: String(os.rateDayHours ?? prev.orderSecurity.rateDayHours),
          rateMaxPerDay: String(os.rateMaxPerDay ?? prev.orderSecurity.rateMaxPerDay),
        },
      }));
    }
  }, [globalSettings]);

  const setByPath = (obj, path, value) => {
    const parts = String(path || "").split(".").filter(Boolean);
    if (!parts.length) return obj;

    const next = { ...obj };
    let cursor = next;

    for (let i = 0; i < parts.length - 1; i += 1) {
      const key = parts[i];
      const existing = cursor[key];
      cursor[key] = existing && typeof existing === "object" ? { ...existing } : {};
      cursor = cursor[key];
    }

    cursor[parts[parts.length - 1]] = value;
    return next;
  };

  const handleChange = (field, value) => {
    if (String(field || "").includes(".")) {
      setSettings((prev) => setByPath(prev, field, value));
      return;
    }
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const os = settings.orderSecurity || {};
      // Prepare data for backend
      const dataToSave = {
        siteName: settings.siteName,
        logo: settings.logo,
        email: settings.siteEmail,
        phone: settings.sitePhone,
        currency: settings.currency,
        // Store settings
        defaultDeliveryFee: parseFloat(settings.shippingFee) || 15,
        freeShippingThreshold:
          parseFloat(settings.freeShippingThreshold) || 100,
        orderSecurity: {
          enableRiskApproval: !!os.enableRiskApproval,
          riskApprovalThreshold: Number.parseInt(os.riskApprovalThreshold, 10) || 50,
          requireVerifiedForOrders: !!os.requireVerifiedForOrders,
          requireOtpBeforeOrders: !!os.requireOtpBeforeOrders,
          otpMethod: os.requireOtpBeforeOrders ? (os.otpMethod || "email") : "none",
          blockSuspiciousUsers: !!os.blockSuspiciousUsers,
          requireShippingPhoneMatchesAccount: !!os.requireShippingPhoneMatchesAccount,
          phoneMinDigits: Number.parseInt(os.phoneMinDigits, 10) || 10,
          phoneMaxDigits: Number.parseInt(os.phoneMaxDigits, 10) || 15,
          duplicateOrderWindowHours: Number.parseInt(os.duplicateOrderWindowHours, 10) || 6,
          sharedIpWindowHours: Number.parseInt(os.sharedIpWindowHours, 10) || 24,
          sharedIpMaxUsers: Number.parseInt(os.sharedIpMaxUsers, 10) || 3,
          rateWindowMinutes: Number.parseInt(os.rateWindowMinutes, 10) || 10,
          rateMaxInWindow: Number.parseInt(os.rateMaxInWindow, 10) || 3,
          rateDayHours: Number.parseInt(os.rateDayHours, 10) || 24,
          rateMaxPerDay: Number.parseInt(os.rateMaxPerDay, 10) || 20,
        },
      };

      const result = await updateGlobalSettings(dataToSave);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Settings saved successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to save settings",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while saving settings",
      });
    } finally {
      setSaving(false);

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }
  };

  return {
    settings,
    activeTab,
    saving,
    message,
    handleChange,
    handleSave,
    setActiveTab,
    setSettings,
  };
}
