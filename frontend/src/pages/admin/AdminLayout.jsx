import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const NAV = [
    { path: "/admin", label: "Dashboard", icon: "dashboard", end: true },
    { path: "/admin/techstack", label: "Tech Stack", icon: "layers" },
    { path: "/admin/services", label: "Services", icon: "category" },
    { path: "/admin/projects", label: "Projects", icon: "folder_open" },
    { path: "/admin/reviews", label: "Client Reviews", icon: "rate_review" },
    { path: "/admin/inquiries", label: "Inquiries", icon: "mail" },
];

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { adminUser, logout } = useAdminAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getCurrentTitle = () => {
        if (location.pathname === "/admin") return "Dashboard";
        if (location.pathname.startsWith("/admin/techstack")) return "Tech Stack";
        if (location.pathname.startsWith("/admin/services")) return "Services";
        if (location.pathname.startsWith("/admin/projects")) return "Projects";
        if (location.pathname.startsWith("/admin/reviews")) return "Client Reviews";
        if (location.pathname.startsWith("/admin/inquiries")) return "Inquiries";
        return "Dashboard";
    };

    // Close mobile sidebar on route navigation
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#f0f2fa] flex relative">
            {/* Mobile Backdrop Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Left Sidebar (Responsive drawer on mobile) */}
            <aside className={`fixed top-0 left-0 h-screen w-64 md:w-60 bg-[#0f172a] text-white flex flex-col z-50 shadow-2xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}>
                {/* Brand */}
                <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
                        <div className="flex flex-col leading-tight">
                            <span className="font-extrabold text-[14px] tracking-wider">OLINETHRA</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Admin CMS</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                        aria-label="Close sidebar"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {NAV.map(n => (
                        <NavLink
                            key={n.path}
                            to={n.path}
                            end={n.end}
                            className={({ isActive }) =>
                                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all text-left ${isActive
                                    ? "bg-[#004fcb] text-white shadow-md"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
                            {n.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / User Profile & Logout */}
                <div className="p-4 border-t border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[180px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="truncate">{adminUser?.email || "Admin"}</span>
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 font-mono text-xs transition-colors cursor-pointer border border-red-500/20"
                    >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="md:ml-60 ml-0 flex-1 min-h-screen min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-black/5 flex items-center px-4 sm:px-8 sticky top-0 z-30 shadow-xs gap-3">
                    {/* Hamburger on the LEFT (mobile only) */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center justify-center shrink-0"
                        aria-label="Toggle sidebar"
                    >
                        <span className="material-symbols-outlined text-[24px]">menu</span>
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] font-mono text-red-500 font-bold uppercase tracking-widest hidden sm:inline shrink-0">
                            Admin Control Panel
                        </span>
                        <span className="text-slate-300 hidden sm:inline">›</span>
                        <span className="font-bold text-[15px] capitalize text-[#171b26] truncate">{getCurrentTitle()}</span>
                    </div>
                </header>

                <main className="p-4 sm:p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

