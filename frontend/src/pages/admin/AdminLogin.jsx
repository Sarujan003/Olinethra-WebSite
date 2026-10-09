import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
    const { loginWithEmail } = useAdminAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await loginWithEmail(email, password);
            navigate("/admin");
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1e293b] border border-slate-700/60 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                {/* Accent glows */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#004fcb] rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#fe6a17] rounded-full blur-3xl opacity-30 pointer-events-none" />

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#004fcb]/10 border border-[#004fcb]/30 mb-3">
                        <img src="/favicon.svg" alt="Olinethra" className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Olinethra CMS</h1>
                    <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-widest">Admin Portal</p>
                </div>

                {error && (
                    <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-start gap-2">
                        <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0">error</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sarujanplus@gmail.com"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#004fcb] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#004fcb] transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-[#004fcb] hover:bg-[#0265ff] disabled:opacity-50 font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Signing in...</span></>
                        ) : (
                            <><span>Sign In</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
