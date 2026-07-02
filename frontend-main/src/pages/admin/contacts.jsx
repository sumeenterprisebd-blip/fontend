import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminContacts from '@/components/admin/AdminContacts';

export default function ContactsPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
                <AdminContacts />
            </AdminLayout>
        </ProtectedRoute>
    );
}
