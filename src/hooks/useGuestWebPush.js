import { useEffect, useMemo, useRef } from "react";
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

export const useGuestWebPush = ({ enabled, orders }) => {
    const didAttemptRef = useRef(false);
    const interactionHandlerRef = useRef(null);

    const safeOrders = useMemo(() => {
        const list = Array.isArray(orders) ? orders : [];
        return list
            .map((x) => ({
                orderId: x?.orderId ? String(x.orderId) : "",
                phone: x?.phone ? String(x.phone) : "",
            }))
            .filter((x) => x.orderId && x.phone)
            .slice(0, 5);
    }, [orders]);

    useEffect(() => {
        if (!enabled) return;
        if (typeof window === "undefined") return;

        // Keep SW/caching out of dev to avoid confusing cache issues.
        if (process.env.NODE_ENV !== "production") return;

        if (safeOrders.length === 0) return;

        if (!("serviceWorker" in navigator)) return;
        if (!("PushManager" in window)) return;
        if (!("Notification" in window)) return;

        const tryEnable = async () => {
            if (didAttemptRef.current) return;
            didAttemptRef.current = true;

            try {
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

                const keyRes = await pushAPI.getPublicKey();
                const publicKey = keyRes?.data?.publicKey;
                if (!publicKey) return;

                const existing = await registration.pushManager.getSubscription();
                if (existing) {
                    const plain = toPlainSubscription(existing);
                    if (plain) {
                        await Promise.all(
                            safeOrders.map((o) =>
                                pushAPI.subscribeGuest({ orderId: o.orderId, phone: o.phone, subscription: plain })
                            )
                        );
                    }
                    return;
                }

                if (Notification.permission === "denied") return;
                if (Notification.permission !== "granted") {
                    const permission = await Notification.requestPermission();
                    if (permission !== "granted") return;
                }

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey),
                });

                const plain = toPlainSubscription(subscription);
                if (plain) {
                    await Promise.all(
                        safeOrders.map((o) =>
                            pushAPI.subscribeGuest({ orderId: o.orderId, phone: o.phone, subscription: plain })
                        )
                    );
                }
            } catch {
                // Best-effort; do not break UX
            }
        };

        if (Notification.permission === "granted") {
            tryEnable();
            return;
        }

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
    }, [enabled, safeOrders]);
};
