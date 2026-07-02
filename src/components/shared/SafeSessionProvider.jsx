import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

/**
 * SafeSessionProvider wraps NextAuth SessionProvider and suppresses
 * session fetch errors to prevent 500 errors from breaking the page.
 * Useful for public pages that don't require authentication.
 */
export default function SafeSessionProvider({ session, children }) {
  useEffect(() => {
    // Suppress NextAuth CLIENT_FETCH_ERROR in console
    const originalError = console.error;
    const errorHandler = (...args) => {
      // Filter out NextAuth session errors
      const firstArg = args[0];
      if (
        typeof firstArg === 'string' &&
        (firstArg.includes('[next-auth]') ||
          firstArg.includes('CLIENT_FETCH_ERROR') ||
          firstArg.includes('/api/auth/session'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    console.error = errorHandler;

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
