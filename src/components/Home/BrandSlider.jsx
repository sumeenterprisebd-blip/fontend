import Image from 'next/image';

export default function BrandSlider({ brands, itemWidth, sliderRef }) {
    // Duplicate brands for seamless infinite loop
    const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

    return (
        <div
            ref={sliderRef}
            className="flex will-change-transform"
        >
            {duplicatedBrands.map((brand, index) => (
                <div
                    key={`${brand._id || brand.id}-${index}`}
                    className="shrink-0 px-3 sm:px-4 lg:px-6"
                    style={itemWidth > 0 ? { width: `${itemWidth}px` } : {}}
                >
                    <div className="relative h-12 lg:h-24 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md flex items-center justify-center p-4 sm:p-6">
                        <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={120}
                            height={80}
                            className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                            onError={(e) => {
                                e.target.src = '/logo.jpeg';
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
