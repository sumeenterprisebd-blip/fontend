import "@/styles/globals.css";
import "@/utils/console"; // Initialize console utilities
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import SafeSessionProvider from "@/components/shared/SafeSessionProvider";

const AppClientRuntime = dynamic(() => import("@/components/shared/AppClientRuntime"), {
  ssr: false,
});

// Inject tracking scripts as early as possible on the client (Meta Pixel detection needs this).
const AnalyticsInjector = dynamic(() => import("@/components/shared/AnalyticsInjector"), {
  ssr: false,
});

// Lazy load heavy components and contexts (saves 15-20 KiB)
const Navbar = dynamic(() => import("@/components/shared/Navbar"), {
  ssr: true,
  loading: () => <div className="h-20 bg-white border-b" />,
});
const Footer = dynamic(() => import("@/components/shared/Footer"), {
  ssr: true,
  loading: () => <div className="h-96 bg-gray-900" />,
});

// Lazy load context providers that aren't needed on every page
const SettingsProvider = dynamic(
  () => import("@/contexts/SettingsContext").then((mod) => mod.SettingsProvider),
  { ssr: true }
);
const CartProvider = dynamic(
  () => import("@/contexts/CartContext").then((mod) => mod.CartProvider),
  { ssr: true }
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [shouldMountClientRuntime, setShouldMountClientRuntime] = useState(false);

  // Defer non-critical client-only boot work into a separate chunk.
  // This reduces initial main-thread JS evaluation in Lighthouse.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (shouldMountClientRuntime) return;

    const pathname = router.pathname || "";
    const isCriticalPage = pathname === "/cart" || pathname === "/checkout";

    // Mount immediately on critical commerce pages.
    if (isCriticalPage) {
      setShouldMountClientRuntime(true);
      return;
    }

    let mounted = false;
    let fallbackTimer;

    const mount = () => {
      if (mounted) return;
      mounted = true;
      setShouldMountClientRuntime(true);
      window.removeEventListener("pointerdown", mount);
      window.removeEventListener("keydown", mount);
      window.removeEventListener("scroll", mount);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };

    window.addEventListener("pointerdown", mount, { once: true, passive: true });
    window.addEventListener("keydown", mount, { once: true });
    window.addEventListener("scroll", mount, { once: true, passive: true });

    const startFallback = () => {
      fallbackTimer = window.setTimeout(mount, 10000);
    };

    if (document?.readyState === "complete") {
      startFallback();
    } else {
      window.addEventListener("load", startFallback, { once: true });
    }

    return () => {
      window.removeEventListener("pointerdown", mount);
      window.removeEventListener("keydown", mount);
      window.removeEventListener("scroll", mount);
      window.removeEventListener("load", startFallback);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [router.pathname, shouldMountClientRuntime]);

  // Check if current page is an admin page
  const isAdminPage = router.pathname.startsWith("/admin");

  return (
    <ErrorBoundary>
      <SafeSessionProvider session={session}>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen overflow-x-hidden">
                  {/* Prevent horizontal overflow */}
                  {/* Show Topbar and Navbar only for non-admin pages */}
                  {!isAdminPage && (
                    <>
                      {/* <Topbar /> */}
                      <Navbar />
                    </>
                  )}
                  <main className="grow">
                    <Component {...pageProps} />
                  </main>
                  {/* Show Footer only for non-admin pages */}
                  {!isAdminPage && <Footer />}

                  {/* Tracking scripts: global, non-SSR, not deferred behind AppClientRuntime */}
                  <AnalyticsInjector disabled={isAdminPage} />

                  {shouldMountClientRuntime && (
                    <AppClientRuntime isAdminPage={isAdminPage} />
                  )}
                </div>
              </CartProvider>
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </SafeSessionProvider>
    </ErrorBoundary>
  );
}
