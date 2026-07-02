/**
 * HeroBasicFields Component
 * Title, subtitle, and description inputs
 */
export default function HeroBasicFields({ formData, errors, handleChange }) {
    return (
        <>
            {/* Title */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., FIND CLOTHES THAT MATCHES YOUR STYLE"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Subtitle & Description */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Subtitle</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        placeholder="Short subtitle"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Hero description..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </>
    );
}
