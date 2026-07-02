import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminHero from '@/components/admin/AdminHero';

export default function AdminHeroPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
                <AdminHero />
            </AdminLayout>
        </ProtectedRoute>
    );
}
