import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotificationsPage from "@/components/admin/AdminNotificationsPage";

export default function AdminNotificationsRoute() {
    return (
        <ProtectedRoute allowedRoles={["admin", "moderator"]}>
            <AdminLayout>
                <AdminNotificationsPage />
            </AdminLayout>
        </ProtectedRoute>
    );
}
