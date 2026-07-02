import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "moderator"]}>
      <AdminLayout>
        <AdminAnalytics />
      </AdminLayout>
    </ProtectedRoute>
  );
}
