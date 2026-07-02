import { FiChevronRight } from 'react-icons/fi';

/**
 * PriceFilter Component
 * Price range filter section
 */
export default function PriceFilter({ priceInputs, onPriceChange, expanded, onToggleExpanded }) {
    return (
        <div className="mb-6 border-b pb-6">
            <button onClick={onToggleExpanded} className="w-full flex items-center justify-between mb-4">
                <h3 className="font-semibold">Price</h3>
                <FiChevronRight className={`w-5 h-5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
            {expanded && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${priceInputs.min === '' || priceInputs.min === undefined ? 'text-gray-300' : 'text-gray-400'}`}>৳</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    value={priceInputs.min === '' || priceInputs.min === undefined ? '' : priceInputs.min}
                                    onChange={(e) => onPriceChange('min', e.target.value)}
                                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <div className="pt-6">
                            <span className="text-gray-400">-</span>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${priceInputs.max === '' || priceInputs.max === undefined ? 'text-gray-300' : 'text-gray-400'}`}>৳</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Max"
                                    value={priceInputs.max === '' || priceInputs.max === undefined ? '' : priceInputs.max}
                                    onChange={(e) => onPriceChange('max', e.target.value)}
                                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Price Range</span>
                            <span className="font-medium text-black">
                                {priceInputs.min === '' || priceInputs.min === undefined ? (
                                    <span className="text-gray-400 italic">Min</span>
                                ) : (
                                    `৳${priceInputs.min}`
                                )}{' '}
                                -{' '}
                                {priceInputs.max === '' || priceInputs.max === undefined ? (
                                    <span className="text-gray-400 italic">Max</span>
                                ) : (
                                    `৳${priceInputs.max}`
                                )}
                            </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                            {(() => {
                                const minValue = priceInputs.min === '' || priceInputs.min === undefined ? null : Number(priceInputs.min);
                                const maxValue = priceInputs.max === '' || priceInputs.max === undefined ? null : Number(priceInputs.max);

                                if (minValue !== null && maxValue !== null && minValue >= 0 && maxValue >= 0) {
                                    const maxRange = 300;
                                    const minPercent = Math.min(100, (minValue / maxRange) * 100);
                                    const maxPercent = Math.min(100, (maxValue / maxRange) * 100);
                                    const width = Math.max(2, maxPercent - minPercent);
                                    return (
                                        <div
                                            className="h-full bg-black transition-all duration-300 rounded-full"
                                            style={{
                                                width: `${width}%`,
                                                marginLeft: `${minPercent}%`
                                            }}
                                        />
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
