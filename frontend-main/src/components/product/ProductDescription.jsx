import { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

export default function ProductDescription({ product }) {
    const [expandedSections, setExpandedSections] = useState({
        description: true,
        care: false,
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const description = product.description || 'This product is perfect for any occasion. Crafted with attention to detail, it offers superior comfort and style.';
    const materialDetail = Array.isArray(product?.tags)
        ? product.tags.find((tag) => /cotton|linen|silk|denim|poly|wool|rayon/i.test(tag))
        : null;
    const materialText = materialDetail ? materialDetail : 'Premium fabric blend';

    // Extract care instructions from description if available
    const careInstructions = [
        'Machine wash in cold water',
        'Use mild detergent',
        'Avoid bleach and fabric softener',
        'Dry on low heat or air dry',
        'Iron on low to medium heat if needed'
    ];

    return (
        <div className="bg-white rounded-2xl xl:rounded-3xl border border-gray-200 shadow-md xl:shadow-lg overflow-hidden px-2 sm:px-4 xl:px-8 py-4 xl:py-8">
            {/* Description Section */}
            <div className="border-b border-gray-100">
                <button
                    onClick={() => toggleSection('description')}
                    className="w-full px-2 xl:px-4 py-3 xl:py-5 flex items-center justify-between hover:bg-gray-50 transition-colors active:bg-gray-100 xl:active:bg-gray-50 group"
                >
                    <h2 className="text-lg xl:text-2xl font-bold text-black tracking-tight">Product Description</h2>
                    <HiOutlineChevronDown
                        className={`w-6 xl:w-7 h-6 xl:h-7 text-gray-500 group-hover:text-black transition-transform duration-300 flex-shrink-0 ${expandedSections.description ? 'rotate-180' : ''}`}
                    />
                </button>
                {expandedSections.description && (
                    <div className="px-2 xl:px-4 pb-4 xl:pb-6 pt-0 border-t border-gray-50">
                        <p className="text-gray-700 leading-relaxed text-base xl:text-lg whitespace-pre-wrap mb-4 xl:mb-6">
                            {description}
                        </p>
                        {/* Key Features */}
                        <div className="mt-4 xl:mt-6 pt-4 xl:pt-6 border-t border-gray-100">
                            <h3 className="text-base xl:text-lg font-semibold text-black mb-3 xl:mb-4">Key Features</h3>
                            <ul className="space-y-2 xl:space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-gray-700 text-base xl:text-lg">{product.dressStyle || 'Versatile'} style</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-gray-700 text-base xl:text-lg">Premium quality materials</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-gray-700 text-base xl:text-lg">Comfortable fit for daily wear</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Fabric & Care Section */}
            <div>
                <button
                    onClick={() => toggleSection('care')}
                    className="w-full px-2 xl:px-4 py-3 xl:py-5 flex items-center justify-between hover:bg-gray-50 transition-colors active:bg-gray-100 xl:active:bg-gray-50 group"
                >
                    <h2 className="text-lg xl:text-2xl font-bold text-black tracking-tight">Fabric &amp; Care</h2>
                    <HiOutlineChevronDown
                        className={`w-6 xl:w-7 h-6 xl:h-7 text-gray-500 group-hover:text-black transition-transform duration-300 flex-shrink-0 ${expandedSections.care ? 'rotate-180' : ''}`}
                    />
                </button>
                {expandedSections.care && (
                    <div className="px-2 xl:px-4 pb-4 xl:pb-6 pt-0 border-t border-gray-50">
                        <div className="mb-4">
                            <p className="text-base xl:text-lg font-semibold text-gray-900">{materialText}</p>
                        </div>
                        <ul className="space-y-2 xl:space-y-3">
                            {careInstructions.map((instruction, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">●</span>
                                    <span className="text-gray-700 text-base xl:text-lg">{instruction}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
