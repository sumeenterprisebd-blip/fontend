import FooterLogo from './footer/FooterLogo';
import FooterContact from './footer/FooterContact';
import FooterColumn from './footer/FooterColumn';
import FooterCopyright from './footer/FooterCopyright';
import NewsletterForm from './footer/NewsletterForm';
import { footerLinks } from '../data/footerData';

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-br from-[#07122b] via-[#0b1f4d] to-[#070b18] text-white mt-auto">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_top,#7dd3fc33,transparent_45%),radial-gradient(circle_at_30%_70%,#60a5fa2b,transparent_35%),radial-gradient(circle_at_90%_20%,#fbbf2433,transparent_28%)]" />
      <div className="pointer-events-none absolute -top-28 right-[-10%] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] h-72 w-72 rounded-full bg-[#38bdf8]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Brand + Highlights */}
        <div className="pt-12 pb-10 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
            <div className="space-y-6">
              <FooterLogo />
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: 'Fast Delivery', desc: '3-5 business days' },
                  { title: 'Easy Returns', desc: '30-day exchange' },
                  { title: 'Live Support', desc: 'WhatsApp & phone' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-white/65">{item.desc}</p>
                  </div>
                ))}
              </div> */}
            </div>

            {/* <div className="rounded-2xl border border-white/15 bg-white/10 p-6 sm:p-7 shadow-[0_20px_60px_rgba(4,8,20,0.35)]">
              <NewsletterForm
                variant="dark"
                title="Stay ahead of the drops"
                description="Weekly releases, size restocks, and member-only offers. No spam, ever."
              />
            </div> */}
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            <FooterContact />
            <FooterColumn title="NAVIGATION" links={footerLinks.navigation} />
            <FooterColumn title="MY ACCOUNT" links={footerLinks.account} />
            <FooterColumn title="SUPPORT" links={footerLinks.support} />
            <FooterColumn title="LEGAL" links={footerLinks.legal} />
          </div>
        </div>

        {/* Copyright Footer */}
        <FooterCopyright />
      </div>
    </footer>
  );
}
