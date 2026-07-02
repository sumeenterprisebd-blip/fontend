import { HiFilter } from "react-icons/hi";

export default function MessageFilters({ filterRead, stats, onFilterChange }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2">
                <HiFilter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onFilterChange("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterRead === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        All ({stats.total})
                    </button>
                    <button
                        onClick={() => onFilterChange("unread")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterRead === "unread"
                                ? "bg-red-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Unread ({stats.unread})
                    </button>
                    <button
                        onClick={() => onFilterChange("read")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterRead === "read"
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Read ({stats.read})
                    </button>
                </div>
            </div>
        </div>
    );
}
