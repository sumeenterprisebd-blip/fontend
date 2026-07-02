const SIZE_MAP = {
    'S': 'S',
    'M': 'M',
    'L': 'L',
    'XL': 'XL',
    'XXL': 'XXL',
    'XS': 'XS',
    'XXS': 'XXS',
    '3XL': '3XL',
    '4XL': '4XL'
};

export default function SizeSelector({ availableSizes, selectedSize, onSizeSelect }) {
    return (
        <div className="mb-6">
            <label className="block text-sm font-semibold text-black mb-3">
                Choose Size {selectedSize && <span className="text-gray-500 font-normal">({SIZE_MAP[selectedSize] || selectedSize})</span>}
            </label>
            <div className="flex gap-3 flex-wrap">
                {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const displaySize = SIZE_MAP[size] || size;
                    return (
                        <button
                            key={size}
                            onClick={() => onSizeSelect(size)}
                            className={`px-6 py-2 rounded transition-all font-medium ${isSelected ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                                }`}
                        >
                            {displaySize}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
