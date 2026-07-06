import SEO from '@/components/shared/SEO';

export default function ShippingPolicyPage() {
    return (
        <>
            <SEO
                title="Shipping Policy | Sume Traders"
                description="Review Sume Traders's shipping timelines, delivery areas, and shipping fees."
                keywords="shipping policy, delivery time, sumetraders shipping"
            />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
                        <p className="text-gray-600 mb-8">Last updated: February 5, 2026</p>

                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Delivery Areas</h2>
                                <p className="text-gray-700 mb-4">
                                    We deliver across Bangladesh. Availability may vary for remote locations.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Delivery Timelines</h2>
                                <p className="text-gray-700 mb-4">
                                    Standard delivery takes 3-5 business days after order confirmation. During peak periods,
                                    deliveries may take slightly longer.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Shipping Fees</h2>
                                <p className="text-gray-700 mb-4">
                                    Shipping fees are calculated at checkout. Orders over ৳500 qualify for free shipping.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Order Tracking</h2>
                                <p className="text-gray-700 mb-4">
                                    Once shipped, you will receive tracking details. You can also track your order from
                                    the <a href="/orders/track" className="text-blue-600 hover:underline">Track Order</a> page.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact</h2>
                                <p className="text-gray-700">
                                    For shipping questions, please contact us via the <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
