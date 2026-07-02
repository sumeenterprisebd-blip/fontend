/**
 * HeroCTAFields Component
 * Call-to-action button configuration
 */
export default function HeroCTAFields({ formData, handleChange }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Button Text</label>
                <input
                    type="text"
                    name="ctaButtonText"
                    value={formData.ctaButtonText}
                    onChange={handleChange}
                    placeholder="Shop Now"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Button Link</label>
                <input
                    type="text"
                    name="ctaButtonLink"
                    value={formData.ctaButtonLink}
                    onChange={handleChange}
                    placeholder="/shop"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
    );
}
