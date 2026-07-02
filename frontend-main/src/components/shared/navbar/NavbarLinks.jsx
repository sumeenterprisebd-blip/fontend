import Link from 'next/link';
import { useRouter } from 'next/router';
import { navLinks } from '../../data/navbarData';

export default function NavbarLinks() {
  const router = useRouter();

  const isActive = (href) => {
    if (href === '/shop') {
      return router.pathname.startsWith('/shop');
    }
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <nav className="hidden lg:flex items-center space-x-7">
      {navLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className={`
              relative flex items-center gap-1 text-[15px] font-semibold transition-all duration-200
              ${active
                ? 'text-[#0a1a44]'
                : 'text-gray-700 hover:text-[#0a1a44]'
              }
            `}
            title={link.description || `Navigate to ${link.label}`}
          >
            {link.label}
            {active && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#0a1a44] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

