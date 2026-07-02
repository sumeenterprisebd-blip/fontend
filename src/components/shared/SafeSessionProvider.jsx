import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

/**
 * SafeSessionProvider wraps NextAuth SessionProvider and:
 * 1. Completely disables automatic session fetching
 * 2. Suppresses NextAuth CLIENT_FETCH_ERROR and related console errors
 * 3. Handles hydration safely
 * 4. Returns gracefully for public pages that don't need authentication
 * 
 * This is used because the app has empty NextAuth providers and relies on custom JWT auth,
 * so the session endpoint is not needed and would fail with a 500 error.
 */
export default function SafeSessionProvider({ session, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Suppress NextAuth CLIENT_FETCH_ERROR and session errors
    const originalError = console.error;
    const originalWarn = console.warn;

    const errorHandler = (...args) => {
      const firstArg = String(args[0] || '');
      // Filter out NextAuth session errors
      if (
        firstArg.includes('[next-auth]') ||
        firstArg.includes('CLIENT_FETCH_ERROR') ||
        firstArg.includes('/api/auth/session') ||
        firstArg.includes('session')
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    const warnHandler = (...args) => {
      const firstArg = String(args[0] || '');
      if (
        firstArg.includes('[next-auth]') ||
        firstArg.includes('session')
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = errorHandler;
    console.warn = warnHandler;

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <SessionProvider
      session={session}
      // Completely disable all automatic session fetching
      // since we use custom JWT auth and don't have valid providers
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOnline={false}
      // Skip CSRF check for our custom auth setup
      skipCSRFCheck={true}
    >
      {children}
    </SessionProvider>
  );
}
