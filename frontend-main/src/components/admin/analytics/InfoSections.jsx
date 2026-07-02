export function InfoBanner() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-blue-600 mt-0.5">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">Understanding Your Charts</h4>
          <p className="text-xs sm:text-sm text-blue-800">
            The charts below show your revenue and order trends over time. Hover over data points for detailed information.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HelpSection() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">Need Help Understanding Your Data?</h4>
          <p className="text-sm text-purple-700">
            📊 <strong>Revenue:</strong> Total money from completed orders<br />
            🛒 <strong>Orders:</strong> Number of purchases made<br />
            👥 <strong>Users:</strong> Registered customers<br />
            💰 <strong>Avg Order Value:</strong> Average amount per purchase
          </p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium whitespace-nowrap">
          View Guide
        </button>
      </div>
    </div>
  );
}
