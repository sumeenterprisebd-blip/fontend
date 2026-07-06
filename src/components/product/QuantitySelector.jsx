import { HiMinus, HiPlus } from 'react-icons/hi';

export default function QuantitySelector({ quantity, maxQuantity, onDecrease, onIncrease, onChange }) {
    const handleInputChange = (event) => {
        const nextValue = Number(event.target.value);
        if (!Number.isFinite(nextValue)) {
            return;
        }

        const safeValue = Math.min(Math.max(1, Math.floor(nextValue)), maxQuantity || 999);
        if (typeof onChange === 'function') {
            onChange(safeValue);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4">
                <label className="text-sm font-semibold text-black">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                        onClick={onDecrease}
                        disabled={quantity <= 1}
                        className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                        type="button"
                    >
                        <HiMinus className="w-5 h-5" />
                    </button>
                    <input
                        type="number"
                        min="1"
                        max={maxQuantity || 999}
                        value={quantity}
                        onChange={handleInputChange}
                        className="w-20 border-x border-gray-200 px-3 py-2 text-center text-lg font-semibold outline-none"
                        aria-label="Enter quantity"
                    />
                    <button
                        onClick={onIncrease}
                        disabled={quantity >= maxQuantity}
                        className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                        type="button"
                    >
                        <HiPlus className="w-5 h-5" />
                    </button>
                </div>
                {maxQuantity < 999 && (
                    <span className="text-xs text-gray-500">Max: {maxQuantity}</span>
                )}
            </div>
        </div>
    );
}
