import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import BlacklistManager from '@/components/admin/BlacklistManager';

export default function AdminBlacklistPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
                <BlacklistManager />
            </AdminLayout>
        </ProtectedRoute>
    );
}
