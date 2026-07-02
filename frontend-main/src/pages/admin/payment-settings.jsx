import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPaymentSettings from "@/components/admin/AdminPaymentSettings";

export default function AdminPaymentSettingsPage() {
    return (
        <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
                <AdminPaymentSettings />
            </AdminLayout>
        </ProtectedRoute>
    );
}
