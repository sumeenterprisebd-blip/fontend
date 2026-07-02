import { FiSearch, FiPhone } from 'react-icons/fi';

export default function TrackOrderForm({ query, setQuery, loading, error, hasSearched, handleTrackOrder, handleReset }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Track your order:</strong> Search by Order ID, Invoice ID, or Phone Number.
                </p>
            </div>
            <form onSubmit={handleTrackOrder} className="space-y-6">
                <div>
                    <label htmlFor="trackQuery" className="block text-sm font-semibold text-gray-900 mb-2">
                        Order ID / Invoice ID / Phone Number
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="trackQuery"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., 01XXXXXXXXX, 10234, or last 8 characters"
                            className="w-full px-4 py-3 pl-11 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                            disabled={loading}
                            inputMode="text"
                            autoComplete="off"
                        />
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        Examples: <span className="font-medium">01XXXXXXXXX</span>, <span className="font-medium">8801XXXXXXXXX</span>, invoice/order number (e.g., <span className="font-medium">10234</span>), or the last 8 characters of your Order ID.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-slideUp">
                        <p className="text-sm text-red-700 flex items-start gap-2">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Tracking...
                            </>
                        ) : (
                            <>
                                <FiSearch className="w-5 h-5" />
                                Track Order
                            </>
                        )}
                    </button>
                    {hasSearched && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-95"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
