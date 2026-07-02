import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

export default function CustomColorForm({ onAddCustomColor }) {
    const [showCustomColor, setShowCustomColor] = useState(false);
    const [customColorName, setCustomColorName] = useState('');
    const [customColorHex, setCustomColorHex] = useState('#000000');
    const [colorError, setColorError] = useState('');

    const handleAddCustomColor = () => {
        const colorName = customColorName.trim();
        if (!colorName) {
            setColorError('Color name is required');
            return;
        }

        const result = onAddCustomColor({ name: colorName, hex: customColorHex });
        if (result?.error) {
            setColorError(result.error);
            return;
        }

        // Reset form
        setCustomColorName('');
        setCustomColorHex('#000000');
        setShowCustomColor(false);
        setColorError('');
    };

    return (
        <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Custom Color</p>
            {!showCustomColor ? (
                <button
                    type="button"
                    onClick={() => setShowCustomColor(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                    <FiPlus size={18} />
                    Add Custom Color
                </button>
            ) : (
                <div className="space-y-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Color Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Navy Blue"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={customColorName}
                                onChange={(e) => {
                                    setCustomColorName(e.target.value);
                                    setColorError('');
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddCustomColor();
                                    }
                                }}
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Color Code (Optional)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                    value={customColorHex}
                                    onChange={(e) => setCustomColorHex(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="#000000"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                                    value={customColorHex}
                                    onChange={(e) => setCustomColorHex(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {colorError && (
                        <p className="text-sm text-red-600">{colorError}</p>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleAddCustomColor}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Add Color
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCustomColor(false);
                                setCustomColorName('');
                                setCustomColorHex('#000000');
                                setColorError('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>

                    <p className="text-xs text-gray-500">
                        Custom colors will be saved with this product
                    </p>
                </div>
            )}
        </div>
    );
}
