import Link from "next/link";

export default function FooterCopyright() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-white/10 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
        <p>
          © {currentYear} Sume Traders. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}

