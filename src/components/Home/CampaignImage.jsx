export default function CampaignImage({ campaign }) {
    return (
        <div className="relative h-64 sm:h-80 lg:h-full min-h-[400px] order-first lg:order-last">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-gray-500/10" />
            <img
                src={campaign.mobileBannerImage && typeof window !== 'undefined' && window.innerWidth < 640
                    ? campaign.mobileBannerImage
                    : campaign.bannerImage}
                alt={campaign.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
            />
            {/* Image Overlay with Pattern */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/10 lg:to-transparent" />

            {/* Floating Discount Badge on Image */}
            {campaign.discountText && (
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl border-2 border-blue-100">
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                        {campaign.discountText}
                    </p>
                </div>
            )}
        </div>
    );
}
