import { FiCheck, FiChevronRight } from 'react-icons/fi';

/**
 * CategoryFilter Component
 * Category selection filter section
 */
export default function CategoryFilter({ categories, selectedCategories, onToggle, expanded, onToggleExpanded, loading }) {
    return (
        <div className="mb-6 border-b pb-6">
            <button onClick={onToggleExpanded} className="w-full flex items-center justify-between mb-4">
                <h3 className="font-semibold">Categories</h3>
                <FiChevronRight className={`w-5 h-5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
            {expanded && (
                <div className="space-y-2">
                    {loading ? (
                        <div className="space-y-3 py-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-sm bg-gray-200 animate-pulse" />
                                        <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
                                    </div>
                                    <div className="h-3 w-10 bg-gray-200 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : categories.length > 0 ? (
                        categories.map((c) => {
                            const sel = selectedCategories.includes(c.name);
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => onToggle(c.name)}
                                    className={`w-full flex items-center justify-between text-sm ${sel ? 'text-black font-medium' : 'text-gray-700'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={`w-4 h-4 flex items-center justify-center border rounded-sm ${sel ? 'bg-black text-white' : 'border-gray-300'}`}>
                                            {sel && <FiCheck className="w-3 h-3" />}
                                        </span>
                                        <span>{c.name}</span>
                                    </span>
                                    <span className="text-gray-400 text-xs">({c.count})</span>
                                </button>
                            );
                        })
                    ) : (
                        <p className="text-xs text-gray-500 text-center py-2">No categories available</p>
                    )}
                </div>
            )}
        </div>
    );
}
