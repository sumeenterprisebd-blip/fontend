import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import ColorPreview from './ColorPreview';
import ColorPicker from './ColorPicker';
import ColorPresets from './ColorPresets';
import ColorFormMessages from './ColorFormMessages';
import ColorModalActions from './ColorModalActions';

export default function AddColorModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [hexCode, setHexCode] = useState('#000000');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Common color presets
    const colorPresets = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Red', hex: '#FF0000' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Green', hex: '#008000' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Purple', hex: '#800080' },
        { name: 'Orange', hex: '#FFA500' },
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Brown', hex: '#A52A2A' },
        { name: 'Gray', hex: '#808080' },
        { name: 'Navy', hex: '#000080' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!name.trim()) {
            setError('Color name is required');
            return;
        }

        if (hexCode && !/^#[0-9A-F]{6}$/i.test(hexCode)) {
            setError('Invalid hex code format. Use format: #RRGGBB');
            return;
        }

        setLoading(true);
        const result = await onAdd({
            name: name.trim(),
            hexCode: hexCode || null
        });
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setName('');
                setHexCode('#000000');
                setSuccess(false);
                onClose();
            }, 1000);
        } else {
            setError(result.error || 'Failed to add color');
        }
    };

    const handleClose = () => {
        if (loading) return;
        setName('');
        setHexCode('#000000');
        setError('');
        setSuccess(false);
        onClose();
    };

    const handleHexChange = (value) => {
        setHexCode(value);
    };

    const selectPreset = (preset) => {
        setName(preset.name);
        setHexCode(preset.hex);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4 animate-fadeIn"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-900">Add New Color</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        disabled={loading}
                        aria-label="Close modal"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <ColorFormMessages success={success} error={error} />
                    <ColorPreview name={name} hexCode={hexCode} />

                    {/* Color Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="e.g., Navy Blue, Forest Green, Crimson Red"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <ColorPicker hexCode={hexCode} onChange={handleHexChange} disabled={loading} />
                    <ColorPresets
                        presets={colorPresets}
                        selectedHex={hexCode}
                        onSelect={selectPreset}
                        disabled={loading}
                    />
                    <ColorModalActions loading={loading} success={success} onCancel={handleClose} />
                </form>
            </div>
        </div>
    );
}
