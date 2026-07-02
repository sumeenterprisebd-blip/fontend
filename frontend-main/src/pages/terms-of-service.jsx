import SEO from '@/components/shared/SEO';

export default function TermsOfService() {
    return (
        <>
            <SEO
                title="Terms of Service | DeshWear"
                description="Read our terms of service to understand the rules and regulations for using DeshWear's website and services."
                keywords="terms of service, terms and conditions, user agreement, legal terms"
            />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                        <p className="text-gray-600 mb-8">Last updated: January 11, 2026</p>

                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
                                <p className="text-gray-700 mb-4">
                                    By accessing and using DeshWear ("the Website"), you agree to be bound by these Terms of Service
                                    ("Terms"). If you do not agree to these Terms, please do not use our Website or services.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Our Service</h2>
                                <p className="text-gray-700 mb-4">You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Use the service in any way that violates any applicable law or regulation</li>
                                    <li>Engage in any conduct that restricts or inhibits anyone's use of the service</li>
                                    <li>Impersonate or attempt to impersonate the company, an employee, another user, or any other person</li>
                                    <li>Use any robot, spider, or other automatic device to access the service</li>
                                    <li>Introduce any viruses, trojan horses, worms, or other malicious material</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
                                <p className="text-gray-700 mb-4">
                                    To access certain features of our service, you may be required to create an account. You agree to:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Provide accurate, current, and complete information during registration</li>
                                    <li>Maintain and promptly update your account information</li>
                                    <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
                                    <li>Notify us immediately of any unauthorized use of your account</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Products and Orders</h2>
                                <p className="text-gray-700 mb-4">
                                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any
                                    order for any reason, including:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Product availability</li>
                                    <li>Errors in product or pricing information</li>
                                    <li>Suspected fraudulent or unauthorized transactions</li>
                                    <li>Issues identified by our credit or fraud prevention department</li>
                                </ul>
                                <p className="text-gray-700 mb-4">
                                    Prices are subject to change without notice. We strive to display accurate product information, but
                                    we do not warrant that product descriptions or other content is accurate, complete, or error-free.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment and Billing</h2>
                                <p className="text-gray-700 mb-4">
                                    Payment must be received by us before we process and ship your order. By providing payment
                                    information, you represent and warrant that:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>You have the legal right to use any payment method provided</li>
                                    <li>The information you provide is true and accurate</li>
                                    <li>You will pay all charges incurred by you or any users of your account</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping and Delivery</h2>
                                <p className="text-gray-700 mb-4">
                                    We will make every effort to deliver products within the estimated timeframes. However, delivery
                                    times are estimates and not guaranteed. We are not liable for any delays in shipping or delivery.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Returns and Refunds</h2>
                                <p className="text-gray-700 mb-4">
                                    Our return and refund policy allows you to return products within a specified period from the date
                                    of delivery. Products must be unused, in their original packaging, and in resalable condition.
                                    Please contact our customer service for return authorization before sending any items back.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property Rights</h2>
                                <p className="text-gray-700 mb-4">
                                    The service and its entire contents, features, and functionality (including but not limited to all
                                    information, software, text, displays, images, video, and audio) are owned by DeshWear, its
                                    licensors, or other providers of such material and are protected by copyright, trademark, and other
                                    intellectual property laws.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                                <p className="text-gray-700 mb-4">
                                    In no event shall DeshWear, its directors, employees, partners, agents, suppliers, or affiliates
                                    be liable for any indirect, incidental, special, consequential, or punitive damages, including
                                    without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Your access to or use of or inability to access or use the service</li>
                                    <li>Any conduct or content of any third party on the service</li>
                                    <li>Any content obtained from the service</li>
                                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
                                <p className="text-gray-700 mb-4">
                                    The service is provided on an "AS IS" and "AS AVAILABLE" basis. DeshWear makes no warranties,
                                    expressed or implied, and hereby disclaims all other warranties including, without limitation,
                                    implied warranties of merchantability, fitness for a particular purpose, or non-infringement of
                                    intellectual property.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
                                <p className="text-gray-700 mb-4">
                                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in
                                    which DeshWear operates, without regard to its conflict of law provisions.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
                                <p className="text-gray-700 mb-4">
                                    We reserve the right to modify or replace these Terms at any time. If a revision is material, we
                                    will provide at least 30 days' notice prior to any new terms taking effect. Your continued use of
                                    the service after any changes constitutes acceptance of the new Terms.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
                                <p className="text-gray-700 mb-4">
                                    If you have any questions about these Terms, please contact us at:
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> legal@deshwear.com<br />
                                        <strong>Website:</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a>
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
