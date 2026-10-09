import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import ProjectCard from "../components/ProjectCard";
import EngineeringLifecycle from "../components/EngineeringLifecycle";

export default function Projects() {
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(
        q,
        snap => {
          if (!snap.empty) {
            setDbProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          } else {
            setDbProjects([]);
          }
          setLoading(false);
        },
        err => {
          console.error("Firestore projects error:", err);
          setLoading(false);
        }
      );
      return () => unsub();
    } catch {
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 space-y-2">
          <span className="text-[12px] font-mono text-[#004fcb] uppercase font-bold tracking-wider">
            GET /api/v1/projects
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#171b26] tracking-tight leading-tight">
            Enterprise Deployments &amp; Case Studies
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#424656] leading-relaxed max-w-3xl font-normal">
            Architectural teardowns and verified production metrics from Olinethra's high-scale deployments.
          </p>
        </div>

        {/* ── Loading Skeleton State ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div
                key={n}
                className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-xs flex flex-col justify-between animate-pulse"
              >
                {/* Thumbnail Skeleton */}
                <div className="h-48 w-full bg-slate-200" />

                {/* Content Skeleton */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Badge */}
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                    {/* Title */}
                    <div className="h-6 w-3/4 bg-slate-200 rounded" />
                    {/* Summary lines */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-3.5 bg-slate-200 rounded w-full" />
                      <div className="h-3.5 bg-slate-200 rounded w-11/12" />
                      <div className="h-3.5 bg-slate-100 rounded w-4/5" />
                    </div>
                  </div>

                  {/* Metrics Box Placeholder */}
                  <div className="p-3 bg-[#f2f3ff] rounded-xl flex gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 bg-slate-200 rounded w-14" />
                      <div className="h-5 bg-slate-300 rounded w-16" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 bg-slate-200 rounded w-14" />
                      <div className="h-5 bg-slate-300 rounded w-16" />
                    </div>
                  </div>

                  {/* Tech Tags Skeleton */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[1, 2, 3].map(t => (
                      <div key={t} className="h-6 w-16 bg-slate-100 rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : dbProjects.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-black/5 max-w-lg mx-auto p-8 shadow-xs">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2 block">
              folder_off
            </span>
            <h3 className="text-lg font-bold text-[#171b26]">No Projects Available</h3>
            <p className="text-sm text-[#424656] mt-1">
              There are currently no case studies published in the database.
            </p>
          </div>
        ) : (
          /* Real Firestore Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbProjects.map(proj => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </main>

      {/* Engineering Lifecycle Section */}
      <EngineeringLifecycle />
    </div>
  );
}