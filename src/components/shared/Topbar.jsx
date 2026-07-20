import Link from "next/link";
import { useMemo } from "react";
import { useSettings } from "@/contexts/SettingsContext";

export default function Topbar() {
  const { settings } = useSettings();
  const freeShippingThreshold = useMemo(() => {
    const raw = Number(settings?.freeShippingThreshold || 0);
    if (!Number.isFinite(raw)) return 999;
    return Math.max(999, raw);
  }, [settings?.freeShippingThreshold]);

  const currencySymbol = settings?.currencySymbol || "৳";

  return (
    <div className="w-full bg-black text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Left Section: Promotional Message */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Free Delivery on {currencySymbol}{Number(freeShippingThreshold).toLocaleString("en-US")}+</span>
            <span className="sm:hidden">Free Delivery {currencySymbol}{Number(freeShippingThreshold).toLocaleString("en-US")}+</span>
          </div>

          {/* Right Section: Contact & Links */}
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="tel:+1234567890"
              className="hidden md:inline hover:text-gray-300 transition-colors"
            >
              +1 (234) 567-890
            </Link>
            <Link
              href="mailto:mssumetreader@gmail.com"
              className="hidden lg:inline hover:text-gray-300 transition-colors"
            >
              mssumetreader@gmail.com
            </Link>
            <Link
              href="/track-order"
              className="hover:text-gray-300 transition-colors"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

