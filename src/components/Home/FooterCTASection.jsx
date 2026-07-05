import Link from 'next/link';
import NewsletterForm from '@/components/shared/footer/NewsletterForm';

export default function FooterCTASection() {
    return (
        <section className="w-full bg-[#0a1a44] py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="text-white">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3">
                            Ready to refresh your wardrobe?
                        </h2>
                        <p className="text-sm sm:text-base text-white/80 mb-6 max-w-xl">
                            Shop the latest drops or reach out for styling help—Sume Traders is here for you.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/shop"
                                className="bg-white text-[#0a1a44] px-6 py-3 rounded-full font-semibold text-sm sm:text-base shadow-md hover:bg-gray-100 transition-colors"
                            >
                                Shop Now
                            </Link>
                            <Link
                                href="/contact"
                                className="border border-white/70 text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
