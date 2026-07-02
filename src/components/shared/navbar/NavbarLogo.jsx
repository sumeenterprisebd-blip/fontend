import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/contexts/SettingsContext';
import { useState } from 'react';

export default function NavbarLogo() {
  const { settings, loading } = useSettings();
  const [imageError, setImageError] = useState(false);

  // Determine which logo to use
  const logoSrc = imageError || !settings?.logo ? '/logo.jpeg' : settings.logo;

  // Check if logo is external (from backend)
  const isExternalLogo = logoSrc && logoSrc.includes('http');

  return (
    <div className="shrink-0">
      <Link
        href="/"
        prefetch={false}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {!imageError && logoSrc && (
          <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {isExternalLogo ? (
              <img
                src={logoSrc}
                alt={settings?.siteName || 'DeshWear'}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={() => {
                  setImageError(true);
                }}
              />
            ) : (
              <Image
                src={logoSrc}
                alt={settings?.siteName || 'DeshWear'}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
                onError={() => {
                  setImageError(true);
                }}
              />
            )}
          </div>
        )}
        <span className="sr-only sm:not-sr-only text-base sm:text-xl lg:text-2xl font-bold text-[#0a1a44]">
          {settings?.siteName || 'DeshWear'}
        </span>
      </Link>
    </div>
  );
}

