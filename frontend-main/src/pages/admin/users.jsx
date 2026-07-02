import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminUsers from '@/components/admin/AdminUsers';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <AdminUsers />
      </AdminLayout>
    </ProtectedRoute>
  );
}
