import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAdvancePayments from '@/components/admin/AdminAdvancePayments';

export default function AdminAdvancePaymentsPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
                <AdminAdvancePayments />
            </AdminLayout>
        </ProtectedRoute>
    );
}
