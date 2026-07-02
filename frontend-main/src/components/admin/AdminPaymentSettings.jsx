import { FiSave } from "react-icons/fi";
import { useAdminPaymentSettings } from "@/hooks/useAdminPaymentSettings";

export default function AdminPaymentSettings() {
    const { settings, loading, saving, message, setField, save } = useAdminPaymentSettings();

    const ssl = settings?.sslcommerz || {};

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Settings</h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Configure SSLCommerz online payment</p>
                </div>
                <button
                    onClick={save}
                    disabled={saving || loading}
                    className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 text-sm sm:text-base"
                >
                    <FiSave className="mr-2" size={20} />
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>

            {message.text && (
                <div
                    className={`px-4 py-3 rounded-lg ${message.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="p-5 sm:p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold text-gray-900">Enable SSLCommerz</div>
                            <div className="text-xs text-gray-500">Show online payment option in checkout</div>
                        </div>
                        <input
                            type="checkbox"
                            checked={!!ssl.enabled}
                            onChange={(e) => setField("sslcommerz.enabled", e.target.checked)}
                            className="h-5 w-5"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold text-gray-900">Sandbox Mode</div>
                            <div className="text-xs text-gray-500">Use SSLCommerz sandbox endpoints for testing</div>
                        </div>
                        <input
                            type="checkbox"
                            checked={!!ssl.sandbox}
                            onChange={(e) => setField("sslcommerz.sandbox", e.target.checked)}
                            className="h-5 w-5"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Store ID</label>
                            <input
                                type="text"
                                value={ssl.storeId || ""}
                                onChange={(e) => setField("sslcommerz.storeId", e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="Your SSLCommerz Store ID"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Store Password</label>
                            <input
                                type="password"
                                value={ssl.storePassword || ""}
                                onChange={(e) => setField("sslcommerz.storePassword", e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder={ssl.storePasswordConfigured ? "Configured (leave blank to keep)" : "Enter Store Password"}
                                disabled={loading}
                                autoComplete="new-password"
                            />
                            <div className="mt-1 text-xs text-gray-500">
                                {ssl.storePasswordConfigured ? "Password is stored securely. Leave blank to keep existing." : "Password will be stored securely on the server."}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 text-xs text-gray-600">
                        <div className="font-semibold text-gray-800 mb-1">Notes</div>
                        <div>- Set `PAYMENT_SETTINGS_ENCRYPTION_KEY` on the backend to save the Store Password.</div>
                        <div>- Set `BACKEND_URL` (recommended) so SSLCommerz callbacks hit the correct domain.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
