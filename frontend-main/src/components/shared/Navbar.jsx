import NavbarLogo from './navbar/NavbarLogo';
import NavbarLinks from './navbar/NavbarLinks';
import NavbarSearch from './navbar/NavbarSearch';
import NavbarActions from './navbar/NavbarActions';
import NavbarMobile from './navbar/NavbarMobile';

export default function Navbar() {
  return (
    <>
      <div className="h-16 lg:h-20" aria-hidden="true" />
      <nav className="w-full bg-white/95 backdrop-blur border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between h-20 gap-6">
            {/* Left Section: Logo & Navigation Links */}
            <div className="flex items-center gap-8 shrink-0">
              <NavbarLogo />
              <NavbarLinks />
            </div>

            {/* Center Section: Search Bar */}
            <NavbarSearch />

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <NavbarActions />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex items-center justify-between h-16 gap-2">
            {/* Left: Menu Icon */}
            <div className="shrink-0">
              <NavbarMobile />
            </div>

            {/* Center: Logo */}
            <div className="flex-1 min-w-0 flex justify-center">
              <NavbarLogo />
            </div>

            {/* Right: Search, Cart, User Icons */}
            <div className="shrink-0">
              <NavbarActions />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
