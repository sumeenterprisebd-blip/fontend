import SEO from '@/components/shared/SEO';

export default function ReturnPolicyPage() {
    return (
        <>
            <SEO
                title="Return Policy | DeshWear"
                description="Learn about DeshWear's return and exchange policy, eligibility, timelines, and how to start a return."
                keywords="return policy, exchange policy, deshwear returns"
            />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Return & Exchange Policy</h1>
                        <p className="text-gray-600 mb-8">Last updated: February 5, 2026</p>

                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Eligibility</h2>
                                <p className="text-gray-700 mb-4">
                                    Items can be returned or exchanged within 30 days of delivery if they are unused, unwashed,
                                    and in original packaging with tags intact.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Return Process</h2>
                                <p className="text-gray-700 mb-4">
                                    Contact our support team with your order number and reason for return. We will confirm the
                                    request and share next steps for pickup or drop-off.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Exchanges</h2>
                                <p className="text-gray-700 mb-4">
                                    Exchanges are available for size or color changes, subject to stock availability. If your
                                    preferred variant is unavailable, we will process a refund instead.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refunds</h2>
                                <p className="text-gray-700 mb-4">
                                    Once we receive and inspect the returned item, refunds are processed within 5-7 business days
                                    to the original payment method.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Non-Returnable Items</h2>
                                <p className="text-gray-700 mb-4">
                                    Items marked as final sale or promotional items may not be eligible for return or exchange.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact</h2>
                                <p className="text-gray-700">
                                    For help, please reach out via the <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
