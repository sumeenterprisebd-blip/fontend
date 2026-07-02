import { useEffect, useMemo, useState } from "react";
import { isTrackingEnabled } from "@/config/tracking";

const hasScriptSrc = (needle) => {
    if (typeof document === "undefined") return false;
    try {
        const scripts = Array.from(document.getElementsByTagName("script"));
        return scripts.some((s) => typeof s?.src === "string" && s.src.includes(needle));
    } catch {
        return false;
    }
};

const safeBool = (fn) => {
    try {
        return Boolean(fn());
    } catch {
        return false;
    }
};

export default function useTrackingHealth(trackingCodes) {
    const trackingEnabled = isTrackingEnabled();

    const ids = useMemo(
        () => ({
            gtmId: String(trackingCodes?.gtmId || "").trim(),
            gaId: String(trackingCodes?.googleAnalyticsMeasurementId || "").trim(),
            clarityId: String(trackingCodes?.microsoftClarityProjectId || "").trim(),
            pixelId: String(trackingCodes?.facebookPixelId || "").trim(),
        }),
        [
            trackingCodes?.gtmId,
            trackingCodes?.googleAnalyticsMeasurementId,
            trackingCodes?.microsoftClarityProjectId,
            trackingCodes?.facebookPixelId,
        ]
    );

    const consent = useMemo(
        () => ({ hasConsent: trackingEnabled, reason: trackingEnabled ? "not-gated" : "env-disabled" }),
        [trackingEnabled]
    );
    const [runtime, setRuntime] = useState({
        gtm: { scriptPresent: false, loaded: false },
        ga4: { scriptPresent: false, loaded: false },
        clarity: { scriptPresent: false, loaded: false },
        pixel: { scriptPresent: false, loaded: false },
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        let cancelled = false;

        const hasAnyConfigured = Boolean(ids.gtmId || ids.gaId || ids.clarityId || ids.pixelId);

        const check = () => {
            if (cancelled) return;

            const gtmScriptPresent = ids.gtmId ? hasScriptSrc(`googletagmanager.com/gtm.js?id=${encodeURIComponent(ids.gtmId)}`) : false;
            const gaScriptPresent = ids.gaId ? hasScriptSrc(`googletagmanager.com/gtag/js?id=${encodeURIComponent(ids.gaId)}`) : false;
            const clarityScriptPresent = ids.clarityId ? hasScriptSrc(`clarity.ms/tag/${encodeURIComponent(ids.clarityId)}`) : false;
            const pixelScriptPresent = hasScriptSrc("connect.facebook.net") || hasScriptSrc("fbevents.js");

            const gaLoaded = safeBool(() => typeof window.gtag === "function" && Array.isArray(window.dataLayer));
            const gtmLoaded = safeBool(() => Array.isArray(window.dataLayer));
            const clarityLoaded = safeBool(() => typeof window.clarity === "function");
            const pixelLoaded = safeBool(() => typeof window.fbq === "function" && (window.fbq.loaded || window._fbq));

            setRuntime({
                gtm: { scriptPresent: gtmScriptPresent, loaded: gtmLoaded },
                ga4: { scriptPresent: gaScriptPresent, loaded: gaLoaded },
                clarity: { scriptPresent: clarityScriptPresent, loaded: clarityLoaded },
                pixel: { scriptPresent: pixelScriptPresent, loaded: pixelLoaded },
            });
        };

        check();

        // Only poll while at least one service is configured.
        // This avoids background work on admin pages when nothing is set.
        if (!hasAnyConfigured) {
            return () => {
                cancelled = true;
            };
        }

        const interval = window.setInterval(check, 1500);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [ids.gtmId, ids.gaId, ids.clarityId, ids.pixelId]);

    const services = useMemo(() => {
        const blocked = !trackingEnabled;

        const gtmConfigured = Boolean(ids.gtmId);
        const gaConfigured = Boolean(ids.gaId);
        const clarityConfigured = Boolean(ids.clarityId);
        const pixelConfigured = Boolean(ids.pixelId);

        const toStatus = (configured, r) => {
            if (!configured) {
                return { configured: false, blocked, state: "inactive" };
            }
            if (blocked) {
                return { configured: true, blocked: true, state: "blocked" };
            }
            if (r.loaded) {
                return { configured: true, blocked: false, state: "loaded" };
            }
            if (r.scriptPresent) {
                return { configured: true, blocked: false, state: "loading" };
            }
            return { configured: true, blocked: false, state: "pending" };
        };

        return {
            gtm: toStatus(gtmConfigured, runtime.gtm),
            ga4: toStatus(gaConfigured, runtime.ga4),
            clarity: toStatus(clarityConfigured, runtime.clarity),
            pixel: toStatus(pixelConfigured, runtime.pixel),
        };
    }, [trackingEnabled, ids.gtmId, ids.gaId, ids.clarityId, ids.pixelId, runtime]);

    return {
        consent,
        services,
        runtime,
    };
}

