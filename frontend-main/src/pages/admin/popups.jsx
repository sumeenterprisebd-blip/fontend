import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPopups from '@/components/admin/AdminPopups';

export default function AdminPopupsPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
                <AdminPopups />
            </AdminLayout>
        </ProtectedRoute>
    );
}
