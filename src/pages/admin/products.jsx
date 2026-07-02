import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProducts from '@/components/admin/AdminProducts';

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <AdminProducts />
      </AdminLayout>
    </ProtectedRoute>
  );
}

