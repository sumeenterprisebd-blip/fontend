import { FiCheckCircle, FiCode, FiInfo, FiXCircle } from "react-icons/fi";
import SaveButton from "./SaveButton";
import MessageAlert from "./MessageAlert";

/**
 * TrackingCodesConfig Component
 * Responsibility: Compose tracking codes UI only
 * Max Lines: 80-120 ✅
 */
export default function TrackingCodesConfig({
    trackingCodes,
    onCodeChange,
    onSave,
    saving,
    message,
    errors,
    detectedGtmId,
    isValid,
    onNormalize,
    validation,
    health,
}) {
    const rawGtmId = trackingCodes?.gtmId ?? "";
    const rawFacebookPixelId = trackingCodes?.facebookPixelId ?? "";
    const rawGaMeasurementId = trackingCodes?.googleAnalyticsMeasurementId ?? "";
    const rawClarityProjectId = trackingCodes?.microsoftClarityProjectId ?? "";

    const liveErrors = validation?.errors || {};
    const effectiveErrors = { ...liveErrors, ...(errors || {}) };

    const gtmErrorText = effectiveErrors?.gtmId || "";
    const fbErrorText = effectiveErrors?.facebookPixelId || "";
    const gaErrorText = effectiveErrors?.googleAnalyticsMeasurementId || "";
    const clarityErrorText = effectiveErrors?.microsoftClarityProjectId || "";

    const showInvalidGtm = !isValid && String(rawGtmId || "").trim().length > 0;
    const inlineGtmErrorText = gtmErrorText || (showInvalidGtm ? "Invalid GTM code. Use GTM-XXXXXXX or paste the official GTM snippet." : "");

    const consentLabel = "Disabled";
    const consentHint = "Tracking scripts are not gated by cookie consent.";

    const statusBadge = (state) => {
        switch (state) {
            case "loaded":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "loading":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "pending":
                return "bg-gray-50 text-gray-700 border-gray-200";
            case "blocked":
                return "bg-amber-50 text-amber-800 border-amber-200";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const stateLabel = (state, configured) => {
        if (!configured) return "Inactive";
        switch (state) {
            case "loaded":
                return "Active";
            case "loading":
                return "Loading";
            case "pending":
                return "Pending";
            case "blocked":
                return "Blocked";
            default:
                return "Unknown";
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-sm">
                        <FiCode className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Tracking Codes Configuration</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Configure your analytics tracking IDs. These settings are stored in backend Settings and applied site-wide.
                        </p>
                    </div>
                </div>

                <div className="shrink-0">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${isValid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                        {isValid ? <FiCheckCircle size={14} /> : <FiXCircle size={14} />}
                        {isValid ? "Valid" : "Fix input"}
                    </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900">
                                Google Tag Manager (GTM) Container ID
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                Accepted: <span className="font-semibold">GTM-XXXXXXX</span> (or paste the official GTM snippet and we’ll extract the ID).
                            </p>

                            <div className="mt-3">
                                <input
                                    type="text"
                                    value={rawGtmId}
                                    onChange={(e) => onCodeChange("gtmId", e.target.value)}
                                    onBlur={() => onNormalize?.("gtmId")}
                                    className={`w-full rounded-xl px-4 py-3 border bg-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${inlineGtmErrorText ? "border-rose-300" : "border-gray-300"}`}
                                    placeholder="GTM-XXXXXXX"
                                    autoComplete="off"
                                    inputMode="text"
                                    spellCheck={false}
                                />
                                {inlineGtmErrorText ? (
                                    <p className="mt-2 text-sm text-rose-700">{inlineGtmErrorText}</p>
                                ) : (
                                    <p className="mt-2 text-xs text-gray-500">Leave blank if you don’t use GTM.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900">
                                Facebook Pixel ID
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                Paste the Pixel ID (numbers) or the full Pixel snippet.
                            </p>

                            <div className="mt-3">
                                <input
                                    type="text"
                                    value={rawFacebookPixelId}
                                    onChange={(e) => onCodeChange("facebookPixelId", e.target.value)}
                                    onBlur={() => onNormalize?.("facebookPixelId")}
                                    className={`w-full rounded-xl px-4 py-3 border bg-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${fbErrorText ? "border-rose-300" : "border-gray-300"}`}
                                    placeholder="123456789012345"
                                    autoComplete="off"
                                    inputMode="text"
                                    spellCheck={false}
                                />
                                {fbErrorText ? (
                                    <p className="mt-2 text-sm text-rose-700">{fbErrorText}</p>
                                ) : (
                                    <p className="mt-2 text-xs text-gray-500">Leave blank if you don’t use Facebook Pixel.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900">
                                Google Analytics 4 Measurement ID
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                Accepted: <span className="font-semibold">G-XXXXXXXXXX</span> (or paste the GA snippet and we’ll extract the ID).
                            </p>

                            <div className="mt-3">
                                <input
                                    type="text"
                                    value={rawGaMeasurementId}
                                    onChange={(e) => onCodeChange("googleAnalyticsMeasurementId", e.target.value)}
                                    onBlur={() => onNormalize?.("googleAnalyticsMeasurementId")}
                                    className={`w-full rounded-xl px-4 py-3 border bg-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${gaErrorText ? "border-rose-300" : "border-gray-300"}`}
                                    placeholder="G-XXXXXXXXXX"
                                    autoComplete="off"
                                    inputMode="text"
                                    spellCheck={false}
                                />
                                {gaErrorText ? (
                                    <p className="mt-2 text-sm text-rose-700">{gaErrorText}</p>
                                ) : (
                                    <p className="mt-2 text-xs text-gray-500">Leave blank if you don’t use Google Analytics.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900">
                                Microsoft Clarity Project ID
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                Paste the Project ID or the full Clarity snippet.
                            </p>

                            <div className="mt-3">
                                <input
                                    type="text"
                                    value={rawClarityProjectId}
                                    onChange={(e) => onCodeChange("microsoftClarityProjectId", e.target.value)}
                                    onBlur={() => onNormalize?.("microsoftClarityProjectId")}
                                    className={`w-full rounded-xl px-4 py-3 border bg-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${clarityErrorText ? "border-rose-300" : "border-gray-300"}`}
                                    placeholder="abcd1234"
                                    autoComplete="off"
                                    inputMode="text"
                                    spellCheck={false}
                                />
                                {clarityErrorText ? (
                                    <p className="mt-2 text-sm text-rose-700">{clarityErrorText}</p>
                                ) : (
                                    <p className="mt-2 text-xs text-gray-500">Leave blank if you don’t use Microsoft Clarity.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <SaveButton onClick={onSave} saving={saving} disabled={!isValid} />
                        {message ? <div className="mt-3"><MessageAlert message={message} /></div> : null}
                    </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-start gap-2">
                        <FiInfo className="text-gray-500 mt-0.5" size={16} />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Status</p>
                            <p className="text-xs text-gray-600 mt-1">
                                This setting is stored in your backend Settings and used by the site’s analytics loader.
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                        <p className="text-xs text-gray-500">Consent gate</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{consentLabel}</p>
                        <p className="text-xs text-gray-600 mt-2">{consentHint}</p>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                            <p className="text-xs text-gray-500">Detected GTM ID</p>
                            <p className="mt-1 font-mono text-sm text-gray-900 break-all">
                                {detectedGtmId || ""}
                            </p>
                            {!detectedGtmId ? (
                                <p className="text-xs text-gray-500 mt-2">No GTM configured.</p>
                            ) : null}
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                            <p className="text-xs text-gray-500">Tracking health</p>
                            <div className="mt-2 space-y-2">
                                {[
                                    { key: "gtm", label: "Google Tag Manager" },
                                    { key: "ga4", label: "Google Analytics (GA4)" },
                                    { key: "pixel", label: "Facebook Pixel" },
                                    { key: "clarity", label: "Microsoft Clarity" },
                                ].map((row) => {
                                    const svc = health?.services?.[row.key];
                                    const state = svc?.state;
                                    const configured = Boolean(svc?.configured);
                                    const label = stateLabel(state, configured);
                                    return (
                                        <div key={row.key} className="flex items-center justify-between gap-3">
                                            <p className="text-xs text-gray-700">{row.label}</p>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold border ${statusBadge(state)}`}>
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-gray-500 mt-3">
                                Note: scripts are loaded lazily and may show “Pending” until initial runtime loads.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                            <p className="text-xs text-gray-500">Configured IDs</p>
                            <div className="mt-2 space-y-2">
                                <div>
                                    <p className="text-[11px] text-gray-500">Facebook Pixel</p>
                                    <p className="font-mono text-sm text-gray-900 break-all">{rawFacebookPixelId || ""}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500">GA4 Measurement</p>
                                    <p className="font-mono text-sm text-gray-900 break-all">{rawGaMeasurementId || ""}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500">Clarity Project</p>
                                    <p className="font-mono text-sm text-gray-900 break-all">{rawClarityProjectId || ""}</p>
                                </div>
                            </div>
                            {!rawFacebookPixelId && !rawGaMeasurementId && !rawClarityProjectId ? (
                                <p className="text-xs text-gray-500 mt-2">No additional tracking configured.</p>
                            ) : null}
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                            <p className="text-xs text-gray-500">Performance & privacy</p>
                            <p className="text-xs text-gray-600 mt-2">
                                Tracking scripts are deferred to reduce impact on page performance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
