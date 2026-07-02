import { useEffect, useRef } from "react";
import { pushAPI } from "@/services/api";

const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const toPlainSubscription = (sub) => {
    if (!sub) return null;
    if (typeof sub.toJSON === "function") return sub.toJSON();
    try {
        return JSON.parse(JSON.stringify(sub));
    } catch {
        return null;
    }
};

export const useUserWebPush = ({ enabled }) => {
    const didAttemptRef = useRef(false);
    const interactionHandlerRef = useRef(null);

    useEffect(() => {
        if (!enabled) return;
        if (typeof window === "undefined") return;

        // Keep SW/caching out of dev to avoid confusing cache issues.
        if (process.env.NODE_ENV !== "production") return;

        if (!("serviceWorker" in navigator)) return;
        if (!("PushManager" in window)) return;
        if (!("Notification" in window)) return;

        const tryEnable = async () => {
            if (didAttemptRef.current) return;
            didAttemptRef.current = true;

            try {
                // Ensure SW is registered
                let registration = await navigator.serviceWorker.getRegistration("/");
                if (!registration) {
                    registration = await navigator.serviceWorker.register("/sw.js");
                }

                try {
                    registration = await navigator.serviceWorker.ready;
                } catch {
                    // ignore
                }

                try {
                    await registration.update();
                } catch {
                    // ignore
                }

                // If already subscribed, just sync it to backend (idempotent)
                const existing = await registration.pushManager.getSubscription();
                if (existing) {
                    const plain = toPlainSubscription(existing);
                    if (plain) {
                        await pushAPI.subscribeUser(plain);
                    }
                    return;
                }

                // Permission gate
                if (Notification.permission === "denied") return;
                if (Notification.permission !== "granted") {
                    const permission = await Notification.requestPermission();
                    if (permission !== "granted") return;
                }

                const keyRes = await pushAPI.getPublicKey();
                const publicKey = keyRes?.data?.publicKey;
                if (!publicKey) return;

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey),
                });

                const plain = toPlainSubscription(subscription);
                if (plain) {
                    await pushAPI.subscribeUser(plain);
                }
            } catch {
                // Best-effort; do not break user UX
            }
        };

        // If already granted, subscribe immediately
        if (Notification.permission === "granted") {
            tryEnable();
            return;
        }

        // Otherwise, browsers require a user gesture
        const onFirstInteraction = () => {
            tryEnable();
        };

        interactionHandlerRef.current = onFirstInteraction;
        window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
        window.addEventListener("keydown", onFirstInteraction, { once: true });

        return () => {
            if (interactionHandlerRef.current) {
                window.removeEventListener("pointerdown", interactionHandlerRef.current);
                window.removeEventListener("keydown", interactionHandlerRef.current);
            }
        };
    }, [enabled]);
};
