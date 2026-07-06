import Head from 'next/head';
import SEO from '@/components/shared/SEO';

export default function PrivacyPolicy() {
    return (
        <>
            <SEO
                title="Privacy Policy | Drip Drop"
                description="Read our privacy policy to understand how Drip Drop collects, uses, and protects your personal information. Learn about your privacy rights and data protection."
                keywords="privacy policy, data protection, personal information, user privacy, GDPR"
            />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-gray-600 mb-8">Last updated: January 11, 2026</p>

                        <div className="prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                                <p className="text-gray-700 mb-4">
                                    Welcome to Sume Traders. We respect your privacy and are committed to protecting your personal data.
                                    This privacy policy will inform you about how we look after your personal data when you visit our
                                    website and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                                <p className="text-gray-700 mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li><strong>Identity Data:</strong> First name, last name, username or similar identifier</li>
                                    <li><strong>Contact Data:</strong> Email address, telephone number, billing address, delivery address</li>
                                    <li><strong>Transaction Data:</strong> Details about payments and purchases from you</li>
                                    <li><strong>Technical Data:</strong> IP address, browser type, time zone setting, operating system</li>
                                    <li><strong>Usage Data:</strong> Information about how you use our website and products</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                                <p className="text-gray-700 mb-4">We use your personal data for the following purposes:</p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>To process and deliver your orders</li>
                                    <li>To manage your account and provide customer support</li>
                                    <li>To send you important updates about your orders</li>
                                    <li>To improve our website and services</li>
                                    <li>To personalize your shopping experience</li>
                                    <li>To comply with legal obligations</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                                <p className="text-gray-700 mb-4">
                                    We have put in place appropriate security measures to prevent your personal data from being
                                    accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access
                                    to your personal data to those employees, agents, contractors and other third parties who have a
                                    business need to know.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
                                <p className="text-gray-700 mb-4">
                                    We will only retain your personal data for as long as necessary to fulfill the purposes we
                                    collected it for, including for the purposes of satisfying any legal, accounting, or reporting
                                    requirements.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                                <p className="text-gray-700 mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                    <li>Right to access your personal data</li>
                                    <li>Right to correct your personal data</li>
                                    <li>Right to erase your personal data</li>
                                    <li>Right to object to processing of your personal data</li>
                                    <li>Right to data portability</li>
                                    <li>Right to withdraw consent</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
                                <p className="text-gray-700 mb-4">
                                    We use cookies and similar tracking technologies to track activity on our website and store certain
                                    information. You can instruct your browser to refuse all cookies or to indicate when a cookie is
                                    being sent.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Links</h2>
                                <p className="text-gray-700 mb-4">
                                    Our website may include links to third-party websites, plug-ins and applications. Clicking on those
                                    links or enabling those connections may allow third parties to collect or share data about you. We
                                    do not control these third-party websites and are not responsible for their privacy statements.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
                                <p className="text-gray-700 mb-4">
                                    We may update our privacy policy from time to time. We will notify you of any changes by posting
                                    the new privacy policy on this page and updating the "Last updated" date.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
                                <p className="text-gray-700 mb-4">
                                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> privacy@sumetraders.com<br />
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
