import SEO from '@/components/shared/SEO';
import Breadcrumb from '@/components/shop/Breadcrumb';
import ContactForm from '@/components/contact/ContactForm';
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';

export default function ContactPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Sume Traders',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+880-XXX-XXXXXX',
        contactType: 'Customer Service',
        email: 'mssumetreader@gmail.com',
        areaServed: 'BD',
        availableLanguage: ['Bengali', 'English']
      }
    }
  };

  return (
    <>
      <SEO
        title="Contact Sume Traders - Customer Support"
        description="Need help? Our customer support team is ready to assist you with orders, products, or any questions. Reach us via email or contact form."
        keywords="contact sumetraders, customer support, help center"
        type="website"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Contact Us', href: '/contact' }
            ]}
          />

          {/* Page Header */}
          <div className="text-center mb-16 mt-8">
            <div className="inline-block mb-6">
              <div className="w-20 h-1 bg-gray-900 mx-auto mb-4"></div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                Get in Touch
              </h1>
              <div className="w-20 h-1 bg-gray-900 mx-auto"></div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;re here to help! Reach out to us with any questions, feedback, or inquiries.
              Our team is ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Info Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 h-fit lg:sticky lg:top-24 transform hover:shadow-3xl transition-all duration-300">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-1 h-8 bg-gray-900 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Contact Information
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 ml-3">Quick ways to reach us</p>
                </div>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex items-start gap-4 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:from-gray-900 group-hover:to-gray-800 transition-all duration-300 shadow-md group-hover:shadow-lg transform group-hover:scale-110">
                      <HiMail className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Email</h3>
                      <Link
                        href="mailto:mssumetreader@gmail.com"
                        className="text-gray-800 hover:text-gray-900 font-semibold transition-colors block break-words"
                      >
                        mssumetreader@gmail.com
                      </Link>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:from-gray-900 group-hover:to-gray-800 transition-all duration-300 shadow-md group-hover:shadow-lg transform group-hover:scale-110">
                      <HiPhone className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Phone</h3>
                      <Link
                        href="tel:+8801835847678"
                        className="text-gray-800 hover:text-gray-900 font-semibold transition-colors block"
                      >
                        +8801835847678
                      </Link>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:from-gray-900 group-hover:to-gray-800 transition-all duration-300 shadow-md group-hover:shadow-lg transform group-hover:scale-110">
                      <HiLocationMarker className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Address</h3>
                      <p className="text-gray-800 font-semibold leading-relaxed">
                        Dhaka, Bangladesh<br />
                        <span className="text-gray-600 font-normal">Section-12 Block-D, Lane-6 Plot-I/15, Pallabi Mirpur Dhaka-1216</span>
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-4 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:from-gray-900 group-hover:to-gray-800 transition-all duration-300 shadow-md group-hover:shadow-lg transform group-hover:scale-110">
                      <HiClock className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Business Hours</h3>
                      <div className="text-gray-800 font-semibold space-y-1.5">
                        <p className="text-sm">Mon - Fri: <span className="text-gray-600 font-normal">9:00 AM - 6:00 PM</span></p>
                        <p className="text-sm">Saturday: <span className="text-gray-600 font-normal">10:00 AM - 4:00 PM</span></p>
                        <p className="text-sm">Sunday: <span className="text-gray-600 font-normal">Closed</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}