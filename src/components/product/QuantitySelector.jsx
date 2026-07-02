import { HiMinus, HiPlus } from 'react-icons/hi';

export default function QuantitySelector({ quantity, maxQuantity, onDecrease, onIncrease }) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-black">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded">
                    <button
                        onClick={onDecrease}
                        disabled={quantity <= 1}
                        className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <HiMinus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 text-lg font-semibold min-w-[60px] text-center">{quantity}</span>
                    <button
                        onClick={onIncrease}
                        disabled={quantity >= maxQuantity}
                        className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
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
