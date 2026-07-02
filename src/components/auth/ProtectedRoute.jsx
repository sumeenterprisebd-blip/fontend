import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false, allowedRoles }) {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const checkAuth = () => {
        const authenticated = isAuthenticated();
        const admin = isAdmin();
        const role = user?.role;

        const redirectUnauthed = () => {
          if (router.pathname !== '/login') {
            router.replace('/login');
          }
        };

        const redirectForbidden = () => {
          // Authenticated but lacks permission.
          // Moderators should land on analytics; everyone else goes to homepage.
          const target = role === 'moderator' ? '/admin/analytics' : '/';
          if (router.pathname !== target) {
            router.replace(target);
          }
        };

        if (!authenticated) {
          redirectUnauthed();
        } else if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
          if (!allowedRoles.includes(role)) {
            redirectForbidden();
          }
        } else if (requireAdmin && !admin) {
          redirectForbidden();
        }
      };

      // Small delay to prevent rapid redirects
      const timeoutId = setTimeout(checkAuth, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, router.pathname, requireAdmin, allowedRoles, user?.role, isAuthenticated, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const role = user?.role;
    if (!allowedRoles.includes(role)) {
      return null;
    }
  } else if (requireAdmin && !isAdmin()) {
    return null;
  }

  return <>{children}</>;
}

