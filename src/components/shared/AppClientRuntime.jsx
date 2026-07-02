import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { scheduleWork } from "@/utils/scheduleWork";

const VercelAnalytics = dynamic(
    () => import("@vercel/analytics/react").then((mod) => mod.Analytics),
    { ssr: false }
);

const MobileBottomNav = dynamic(
    () => import("@/components/shared/MobileBottomNav"),
    { ssr: false }
);

const FloatingSocialButtons = dynamic(
    () => import("@/components/shared/FloatingSocialButtons"),
    { ssr: false }
);

export default function AppClientRuntime({ isAdminPage }) {
    // Tracking scripts are injected globally from _app.

    // Suppress hydration warnings caused by browser extensions
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args) => {
            if (
                typeof args[0] === "string" &&
                args[0].includes("Extra attributes from the server: data-has-listeners")
            ) {
                return;
            }
            originalError.call(console, ...args);
        };

        return () => {
            console.error = originalError;
        };
    }, []);

    // Register service worker for better caching (deferred)
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("serviceWorker" in navigator)) return;
        if (process.env.NODE_ENV !== "production") return;

        let didRegister = false;

        const trigger = () => {
            if (didRegister) return;
            didRegister = true;

            scheduleWork(() => registerServiceWorker(), { timeout: 15000 });

            window.removeEventListener("pointerdown", trigger);
            window.removeEventListener("keydown", trigger);
            window.removeEventListener("scroll", trigger);
        };

        window.addEventListener("pointerdown", trigger, { once: true, passive: true });
        window.addEventListener("keydown", trigger, { once: true });
        window.addEventListener("scroll", trigger, { once: true, passive: true });

        if (document.readyState === "complete") {
            scheduleWork(trigger, { timeout: 20000 });
            return () => {
                window.removeEventListener("pointerdown", trigger);
                window.removeEventListener("keydown", trigger);
                window.removeEventListener("scroll", trigger);
            };
        }

        const onLoad = () => scheduleWork(trigger, { timeout: 20000 });
        window.addEventListener("load", onLoad, { once: true });

        return () => {
            window.removeEventListener("pointerdown", trigger);
            window.removeEventListener("keydown", trigger);
            window.removeEventListener("scroll", trigger);
            window.removeEventListener("load", onLoad);
        };
    }, []);

    const registerServiceWorker = () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                const RELOAD_REQUEST_KEY = "sw:updateAccepted";
                const RELOADED_KEY = "sw:controllerchangeReloaded";

                const promptForUpdate = (waitingWorker) => {
                    if (!waitingWorker) return;
                    const shouldReload = window.confirm(
                        "A new version is available. Reload now to update?"
                    );
                    if (shouldReload) {
                        try {
                            sessionStorage.setItem(RELOAD_REQUEST_KEY, "1");
                        } catch {
                            // ignore
                        }
                        waitingWorker.postMessage({ type: "SKIP_WAITING" });
                    }
                };

                if (registration.waiting) {
                    promptForUpdate(registration.waiting);
                }

                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (!installingWorker) return;
                    installingWorker.onstatechange = () => {
                        if (
                            installingWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            promptForUpdate(registration.waiting);
                        }
                    };
                };

                let refreshing = false;
                navigator.serviceWorker.addEventListener("controllerchange", () => {
                    if (refreshing) return;
                    refreshing = true;

                    let shouldReload = false;
                    try {
                        const accepted = sessionStorage.getItem(RELOAD_REQUEST_KEY) === "1";
                        const alreadyReloaded = sessionStorage.getItem(RELOADED_KEY) === "1";
                        shouldReload = accepted && !alreadyReloaded;
                        if (shouldReload) {
                            sessionStorage.setItem(RELOADED_KEY, "1");
                            sessionStorage.removeItem(RELOAD_REQUEST_KEY);
                        }
                    } catch {
                        // If sessionStorage is unavailable, do NOT force a reload.
                        shouldReload = false;
                    }

                    if (shouldReload) {
                        window.location.reload();
                    }
                });
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
    };

    return (
        <>
            {!isAdminPage && <FloatingSocialButtons />}
            {!isAdminPage && <MobileBottomNav />}
            {!isAdminPage && <VercelAnalytics />}
        </>
    );
}
