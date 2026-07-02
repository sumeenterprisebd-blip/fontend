// Centralized switch for loading third-party tracking scripts.
//
// Modes:
// - off: never load third-party trackers
// - on: always load third-party trackers (even in development)
// - production (default): load only when NODE_ENV === 'production'

export const TRACKING_MODE = process.env.NEXT_PUBLIC_TRACKING_MODE || "production";

export const isTrackingEnabled = () => {
    if (TRACKING_MODE === "off") return false;
    if (TRACKING_MODE === "on") return true;
    return process.env.NODE_ENV === "production";
};
