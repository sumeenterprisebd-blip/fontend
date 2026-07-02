import Image from 'next/image';
import { useSettings } from '@/contexts/SettingsContext';
import { useState } from 'react';

export default function FooterLogo() {
  const { settings } = useSettings();
  const [imageError, setImageError] = useState(false);

  const logoSrc = imageError || !settings?.logo ? '/logo.jpeg' : settings.logo;
  const isExternalLogo = logoSrc && logoSrc.startsWith('http');

  return (
    <div className="flex items-start space-x-4">
      <div className="shrink-0">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden bg-white">
          {isExternalLogo ? (
            <img
              src={logoSrc}
              alt={settings?.siteName || 'DeshWear'}
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
            />
          ) : (
            <Image
              src={logoSrc}
              alt={settings?.siteName || 'DeshWear'}
              width={56}
              height={56}
              className="w-full h-full object-contain"
              quality={70}
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {settings?.siteName || 'DeshWear'}
        </h3>
        <p className="text-sm text-white/70 leading-relaxed">
          {settings?.tagline || 'Everyday essentials, elevated. Limited drops, premium fits, and a smooth checkout experience.'}
        </p>
      </div>
    </div>
  );
}
