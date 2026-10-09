import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ProjectBrief() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchProject() {
            setLoading(true);
            try {
                if (id) {
                    const docRef = doc(db, "projects", id);
                    const snap = await getDoc(docRef);
                    if (snap.exists() && isMounted) {
                        setProject({ id: snap.id, ...snap.data() });
                        setLoading(false);
                        return;
                    }
                }
                if (isMounted) {
                    setProject(null);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Firestore getDoc error:", err);
                if (isMounted) {
                    setProject(null);
                    setLoading(false);
                }
            }
        }

        fetchProject();
        return () => { isMounted = false; };
    }, [id]);

    // ── Skeleton Loading State ──
    if (loading) {
        return (
            <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
                <main className="pt-28 pb-24 max-w-5xl mx-auto px-6 md:px-12 animate-pulse">
                    {/* Back Link Placeholder */}
                    <div className="h-5 w-48 bg-slate-200 rounded-md mb-6" />

                    {/* Banner Box Skeleton */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-black/5 mb-10">
                        {/* Image / Header Placeholder */}
                        <div className="h-72 md:h-96 w-full bg-slate-200 relative flex flex-col justify-end p-6 md:p-10 gap-3">
                            <div className="h-6 w-28 bg-slate-300 rounded-md" />
                            <div className="h-10 w-2/3 bg-slate-300 rounded-lg" />
                            <div className="h-4 w-40 bg-slate-300/80 rounded" />
                        </div>

                        {/* Body Skeleton */}
                        <div className="p-8 md:p-10 space-y-8">
                            {/* Overview Lines */}
                            <div className="space-y-3">
                                <div className="h-4 w-36 bg-slate-200 rounded" />
                                <div className="h-4 bg-slate-200 rounded w-full" />
                                <div className="h-4 bg-slate-200 rounded w-5/6" />
                            </div>

                            {/* Metrics Grid Skeleton */}
                            <div className="bg-[#f2f3ff] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border border-black/5">
                                <div className="bg-white p-5 rounded-xl border border-black/5 space-y-3">
                                    <div className="h-3.5 bg-slate-200 rounded w-20" />
                                    <div className="h-8 bg-slate-200 rounded w-28" />
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-black/5 space-y-3">
                                    <div className="h-3.5 bg-slate-200 rounded w-20" />
                                    <div className="h-8 bg-slate-200 rounded w-28" />
                                </div>
                            </div>

                            {/* Architecture Brief Skeleton */}
                            <div className="bg-[#faf8ff] rounded-2xl p-7 border border-[#004fcb]/10 space-y-4">
                                <div className="h-5 w-52 bg-slate-200 rounded" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-full" />
                                    <div className="h-4 bg-slate-200 rounded w-11/12" />
                                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                                </div>
                            </div>

                            {/* Technologies Skeleton */}
                            <div className="space-y-3 pt-2">
                                <div className="h-4 w-48 bg-slate-200 rounded" />
                                <div className="flex flex-wrap gap-2.5">
                                    {[1, 2, 3, 4].map((n) => (
                                        <div key={n} className="h-9 w-24 bg-slate-200 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ── Not Found State ──
    if (!project) {
        return (
            <div className="bg-[#faf8ff] min-h-screen pt-36 pb-24 flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-black/5 shadow-sm text-center space-y-4">
                    <span className="material-symbols-outlined text-5xl text-slate-400">
                        search_off
                    </span>
                    <h2 className="text-2xl font-bold text-[#171b26]">Project Not Found</h2>
                    <p className="text-sm text-[#424656]">
                        The requested case study could not be found or may have been deleted.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#004fcb] hover:bg-[#0265ff] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Back to Projects
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const badgeText = (project.badge || project.category || "CASE STUDY").toUpperCase();

    return (
        <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
            <main className="pt-28 pb-24 max-w-5xl mx-auto px-6 md:px-12">
                {/* Back Link */}
                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-[#004fcb] hover:text-[#0265ff] transition mb-6 group"
                >
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">
                        arrow_back
                    </span>
                    <span>Back to Projects &amp; Case Studies</span>
                </Link>

                {/* Hero Banner Box */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-black/5 mb-10">
                    <div className="relative h-72 md:h-96 w-full overflow-hidden bg-slate-900">
                        {project.image_url ? (
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-85"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#004fcb] to-[#171b26]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#171b26] via-[#171b26]/40 to-transparent" />

                        <div className="absolute bottom-8 left-6 md:left-10 right-6 md:right-10 space-y-2 text-white">
                            <span className="inline-block px-3.5 py-1 rounded-md bg-[#004fcb] text-[12px] font-mono font-bold uppercase tracking-wider shadow-sm">
                                {badgeText}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                                {project.title}
                            </h1>
                            {project.client && (
                                <p className="text-[14px] text-slate-300 font-medium font-mono">
                                    Client: {project.client}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-8 md:p-10 space-y-8">
                        {/* Executive Overview */}
                        <div className="space-y-2">
                            <h3 className="text-[13px] font-mono font-bold text-[#004fcb] uppercase tracking-wider">
                                EXECUTIVE OVERVIEW
                            </h3>
                            <p className="text-[16px] md:text-[18px] text-[#424656] leading-relaxed font-normal">
                                {project.summary || "No executive summary provided."}
                            </p>
                        </div>

                        {/* KPI Metrics Grid */}
                        {(project.metric1_val || project.metric2_val) && (
                            <div className="bg-[#f2f3ff] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border border-black/5">
                                <div className="bg-white p-5 rounded-xl border border-black/5 shadow-xs">
                                    <span className="text-[13px] font-medium text-slate-500 block mb-1">
                                        {project.metric1_label || "Metric 1"}
                                    </span>
                                    <span className="text-3xl font-extrabold text-[#004fcb]">
                                        {project.metric1_val || "N/A"}
                                    </span>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-black/5 shadow-xs">
                                    <span className="text-[13px] font-medium text-slate-500 block mb-1">
                                        {project.metric2_label || "Metric 2"}
                                    </span>
                                    <span className="text-3xl font-extrabold text-[#fe6a17]">
                                        {project.metric2_val || "N/A"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* System Architecture Brief */}
                        <div className="bg-[#faf8ff] rounded-2xl p-7 border border-[#004fcb]/20 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2.5 text-[#004fcb] font-bold text-[18px]">
                                <span className="material-symbols-outlined text-[24px]">architecture</span>
                                <h2>System Architecture Brief</h2>
                            </div>
                            <p className="text-[15px] md:text-[16px] text-[#424656] leading-relaxed whitespace-pre-line font-normal">
                                {project.brief || project.challenge || "Architecture brief configured via Olinethra Admin Panel."}
                            </p>
                        </div>

                        {/* Technologies & Components */}
                        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <h3 className="text-[13px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                    TECHNOLOGIES &amp; INFRASTRUCTURE
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {project.technologies.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 rounded-xl bg-[#ebedfc] text-[14px] font-mono font-semibold text-[#171b26]"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}