import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminCampaigns from '@/components/admin/AdminCampaigns';

export default function AdminCampaignsPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
                <AdminCampaigns />
            </AdminLayout>
        </ProtectedRoute>
    );
}
