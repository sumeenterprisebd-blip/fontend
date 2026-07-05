import { FiCheckCircle } from '@react-icons/all-files/fi/FiCheckCircle';
import { FiShield } from '@react-icons/all-files/fi/FiShield';
import { FiTruck } from '@react-icons/all-files/fi/FiTruck';
import { FiStar } from '@react-icons/all-files/fi/FiStar';

const reasons = [
    {
        title: 'Rooted in Bangladesh',
        description: 'We design with local culture, seasons, and lifestyles in mind—built for real life here.',
        icon: FiShield,
    },
    {
        title: 'Quality You Can Feel',
        description: 'Premium fabrics, clean stitching, and durable finishing—no shortcuts, ever.',
        icon: FiStar,
    },
    {
        title: 'Fast, Reliable Delivery',
        description: 'Quick dispatch and trusted logistics so your order arrives when you expect it.',
        icon: FiTruck,
    },
    {
        title: 'Care-First Support',
        description: 'Friendly service, easy returns, and real people ready to help you out.',
        icon: FiCheckCircle,
    },
];

export default function WhyDeshWearSection() {
    return (
        <section className="w-full bg-white py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 lg:mb-12 space-y-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide bg-[#0a1a44]/10 text-[#0a1a44]">
                        Why Sume Traders
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a1a44]">
                        A local brand made for your everyday life
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
                        Sume Traders started with a simple promise: make stylish, dependable fashion that feels right for Bangladesh.
                        We focus on quality materials, thoughtful designs, and service that treats you like family.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {reasons.map((reason) => {
                        const Icon = reason.icon;
                        return (
                            <div
                                key={reason.title}
                                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#0a1a44]/10 text-[#0a1a44] flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                    {reason.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {reason.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
