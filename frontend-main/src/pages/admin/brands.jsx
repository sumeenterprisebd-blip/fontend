import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminBrands from '@/components/admin/AdminBrands';

export default function AdminBrandsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <AdminBrands />
      </AdminLayout>
    </ProtectedRoute>
  );
}

