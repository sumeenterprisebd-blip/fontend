import { useEffect, useState } from "react";
import { adminPaymentSettingsAPI } from "@/services/api";

const DEFAULT_STATE = {
    sslcommerz: {
        enabled: false,
        sandbox: true,
        storeId: "",
        storePassword: "",
        storePasswordConfigured: false,
        updatedAt: null,
    },
};

export function useAdminPaymentSettings() {
    const [settings, setSettings] = useState(DEFAULT_STATE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const load = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await adminPaymentSettingsAPI.get();
            const s = res?.data?.settings || {};
            const ssl = s.sslcommerz || {};

            setSettings({
                sslcommerz: {
                    enabled: !!ssl.enabled,
                    sandbox: typeof ssl.sandbox === "boolean" ? ssl.sandbox : true,
                    storeId: String(ssl.storeId || ""),
                    storePassword: "",
                    storePasswordConfigured: !!ssl.storePasswordConfigured,
                    updatedAt: ssl.updatedAt || null,
                },
            });
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.response?.data?.message || "Failed to load payment settings",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const setField = (path, value) => {
        setSettings((prev) => {
            const next = { ...prev };
            next.sslcommerz = { ...(next.sslcommerz || {}) };

            if (path === "sslcommerz.enabled") next.sslcommerz.enabled = !!value;
            if (path === "sslcommerz.sandbox") next.sslcommerz.sandbox = !!value;
            if (path === "sslcommerz.storeId") next.sslcommerz.storeId = String(value || "");
            if (path === "sslcommerz.storePassword") next.sslcommerz.storePassword = String(value || "");

            return next;
        });
    };

    const save = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const payload = {
                sslcommerz: {
                    enabled: !!settings.sslcommerz.enabled,
                    sandbox: !!settings.sslcommerz.sandbox,
                    storeId: String(settings.sslcommerz.storeId || "").trim(),
                    ...(settings.sslcommerz.storePassword
                        ? { storePassword: String(settings.sslcommerz.storePassword) }
                        : {}),
                },
            };

            const res = await adminPaymentSettingsAPI.update(payload);
            const s = res?.data?.settings || {};
            const ssl = s.sslcommerz || {};

            setSettings((prev) => ({
                ...prev,
                sslcommerz: {
                    ...prev.sslcommerz,
                    enabled: !!ssl.enabled,
                    sandbox: typeof ssl.sandbox === "boolean" ? ssl.sandbox : prev.sslcommerz.sandbox,
                    storeId: String(ssl.storeId || prev.sslcommerz.storeId || ""),
                    storePassword: "",
                    storePasswordConfigured: !!ssl.storePasswordConfigured,
                    updatedAt: ssl.updatedAt || null,
                },
            }));

            setMessage({
                type: "success",
                text: res?.data?.message || "Payment settings saved",
            });
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.response?.data?.message || "Failed to save payment settings",
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
        loading,
        saving,
        message,
        setField,
        save,
        reload: load,
    };
}
