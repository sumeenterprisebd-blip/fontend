import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOrders from '@/components/admin/AdminOrders';

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <AdminOrders />
      </AdminLayout>
    </ProtectedRoute>
  );
}

