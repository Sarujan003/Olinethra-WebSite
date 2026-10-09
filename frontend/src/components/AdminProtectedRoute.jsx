import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminProtectedRoute({ children }) {
    const { adminUser, loading } = useAdminAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-mono text-sm">
                <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    <span>Verifying Admin Authorization...</span>
                </div>
            </div>
        );
    }

    if (!adminUser) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
}
