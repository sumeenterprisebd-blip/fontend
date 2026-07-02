import { useEffect, useMemo, useRef } from "react";
import Script from "next/script";
import { useSettings } from "@/contexts/SettingsContext";
import { useRouter } from "next/router";
import { isTrackingEnabled } from "@/config/tracking";

export default function AnalyticsInjector({ disabled = false }) {
    const { settings } = useSettings();
    const router = useRouter();
    const pixelLastTrackedPathRef = useRef("");

    const trackingEnabled = isTrackingEnabled();

    const gtmId = settings?.gtmId;
    const gaId = settings?.googleAnalyticsMeasurementId;
    const clarityId = settings?.microsoftClarityProjectId;
    const facebookPixelId = settings?.facebookPixelId;

    const hasAny = useMemo(
        () => !!(gtmId || gaId || clarityId || facebookPixelId),
        [gtmId, gaId, clarityId, facebookPixelId]
    );

    const trackPixelPageViewOnce = (url) => {
        try {
            if (!facebookPixelId) return;
            if (typeof window === "undefined") return;
            if (typeof window.fbq !== "function") return;

            const normalizedUrl = String(
                url || `${window.location.pathname || ""}${window.location.search || ""}`
            );

            if (pixelLastTrackedPathRef.current === normalizedUrl) return;

            pixelLastTrackedPathRef.current = normalizedUrl;
            window.fbq("track", "PageView");
        } catch {
            // ignore
        }
    };

    // SPA pageview support for GA + GTM + Meta Pixel on route changes
    useEffect(() => {
        if (disabled) return;
        if (!trackingEnabled) return;
        if (!hasAny) return;

        const onRouteChange = (url) => {
            try {
                if (window.gtag && gaId) {
                    window.gtag("config", gaId, { page_path: url });
                }

                // Optional: lightweight GTM SPA support.
                if (gtmId && Array.isArray(window.dataLayer)) {
                    window.dataLayer.push({ event: "pageview", page_path: url });
                }

                // Meta Pixel SPA support.
                if (facebookPixelId) {
                    trackPixelPageViewOnce(url);
                }
            } catch {
                // ignore
            }
        };

        router.events.on("routeChangeComplete", onRouteChange);

        return () => router.events.off("routeChangeComplete", onRouteChange);
    }, [disabled, trackingEnabled, router.events, hasAny, gaId, facebookPixelId, gtmId]);

    if (disabled) return null;
    if (!trackingEnabled) return null;
    if (!hasAny) return null;

    return (
        <>
            {gtmId && (
                <>
                    <Script
                        id={`gtm-init-${gtmId}`}
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html:
                                "window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});",
                        }}
                    />
                    <Script
                        id={`gtm-${gtmId}`}
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
                    />
                </>
            )}

            {gaId && (
                <>
                    <Script
                        id={`ga4-${gaId}`}
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                    />
                    <Script
                        id={`ga4-init-${gaId}`}
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                              window.dataLayer = window.dataLayer || [];
                              function gtag(){dataLayer.push(arguments);}
                              window.gtag = window.gtag || gtag;
                              gtag('js', new Date());
                              gtag('config', '${gaId}', { send_page_view: true });
                            `,
                        }}
                    />
                </>
            )}

            {facebookPixelId && (
                <Script
                    id={`fb-pixel-base-${facebookPixelId}`}
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                                                    (function(){
                                                        var __dwHadFbq = typeof window.fbq === 'function';
                          !function(f,b,e,v,n,t,s)
                          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                          n.queue=[];t=b.createElement(e);t.async=!0;
                          t.src=v;s=b.getElementsByTagName(e)[0];
                          s.parentNode.insertBefore(t,s)}(window, document,'script',
                          'https://connect.facebook.net/en_US/fbevents.js');
                                                        if (!__dwHadFbq) {
                                                            try {
                                                                fbq('init', '${facebookPixelId}');
                                                                window.__dwPixelId = '${facebookPixelId}';
                                                                // Debug logs for Pixel loading and pageview
                                                                try { console.info('Meta Pixel loaded', { pixelId: window.__dwPixelId }); } catch (e) {}
                                                                fbq('track', 'PageView');
                                                                try { console.info('Meta Pixel PageView fired', { pixelId: window.__dwPixelId, url: window.location.pathname + window.location.search }); } catch (e) {}
                                                                window.__dwPixelLastPageViewUrl = window.location.pathname + window.location.search;
                                                            } catch (e) {}
                                                        }
                                                    })();
                        `,
                    }}
                />
            )}

            {clarityId && (
                <Script
                    id={`clarity-${clarityId}`}
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                          (function(c,l,a,r,i,t,y){
                              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                          })(window, document, "clarity", "script", "${clarityId}");
                        `,
                    }}
                />
            )}
        </>
    );
}
