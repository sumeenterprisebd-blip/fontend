import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { contactAPI, adminNotificationsAPI } from '@/services/api';
import { useAdminWebPush } from '@/hooks/useAdminWebPush';
import { FiMenu } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';
import AdminNotificationsMenu from './AdminNotificationsMenu';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsUnreadCount, setNotificationsUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const router = useRouter();

  useAdminWebPush({ enabled: user?.role === 'admin' });

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await contactAPI.getStats();
        if (response.data.success) {
          setUnreadCount(response.data.stats.unread);
        }
      } catch (error) {
      }
    };

    const fetchAdminCounts = async () => {
      try {
        const response = await adminNotificationsAPI.unreadCount();
        if (response.data.success) {
          setNotificationsUnreadCount(Number(response.data.unreadCount || 0));
        }
      } catch (error) {
      }
    };

    if (user?.role === 'admin') {
      fetchUnreadCount();
      fetchAdminCounts();
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchAdminCounts();
      }, 10000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [user]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="lg:hidden fixed top-4 left-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:shadow-xl"
        aria-label="Toggle sidebar"
      >
        <FiMenu size={22} />
      </button>

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        unreadCount={unreadCount}
        notificationsUnreadCount={notificationsUnreadCount}
        onLogout={handleLogout}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {user?.role === 'admin' ? (
        <div className="fixed top-4 right-4 z-50 hidden lg:flex items-center gap-3">
          <AdminNotificationsMenu onCountChange={setNotificationsUnreadCount} />
        </div>
      ) : null}

      <div className="lg:pl-[280px]">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}
