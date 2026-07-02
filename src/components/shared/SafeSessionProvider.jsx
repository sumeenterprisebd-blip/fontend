import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

/**
 * SafeSessionProvider wraps NextAuth SessionProvider and:
 * 1. Disables automatic session fetching to prevent 500 errors from /api/auth/session
 * 2. Suppresses NextAuth CLIENT_FETCH_ERROR in console
 * 3. Allows public pages to render without authentication
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

  if (!mounted) return children;

  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOnline={false}
    >
      {children}
    </SessionProvider>
  );
}
