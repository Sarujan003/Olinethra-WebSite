import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import ProjectCard from "../components/ProjectCard";
import EngineeringLifecycle from "../components/EngineeringLifecycle";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const cardVariant = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
};

function RevealSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 30, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function ProjectsGrid({ projects }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {projects.map(proj => (
        <motion.div key={proj.id} variants={cardVariant}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}>
          <ProjectCard project={proj} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Projects() {
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(q,
        snap => { setDbProjects(snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
        () => setLoading(false)
      );
      return () => unsub();
    } catch { setLoading(false); }
  }, []);

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      {/* Dot-grid */}
      <div className="fixed inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(circle, rgba(31,75,224,0.1) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />

      <main className="relative pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <RevealSection className="mb-12 space-y-3">
          <span className="text-[13px] font-mono font-bold uppercase tracking-wider text-[#1F4BE0]">
            Case Studies
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B1020] tracking-tight leading-tight">
            Enterprise Deployments &amp;{" "}
            <span className="text-[#EA580C]">Case Studies</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#424656] leading-relaxed max-w-3xl font-normal">
            Architectural teardowns and verified production metrics from Olinethra's high-scale deployments.
          </p>
        </RevealSection>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-xs flex flex-col justify-between animate-pulse">
                <div className="h-48 w-full bg-slate-200" />
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                    <div className="h-6 w-3/4 bg-slate-200 rounded" />
                    <div className="space-y-1.5 pt-1">
                      <div className="h-3.5 bg-slate-200 rounded w-full" />
                      <div className="h-3.5 bg-slate-200 rounded w-11/12" />
                      <div className="h-3.5 bg-slate-100 rounded w-4/5" />
                    </div>
                  </div>
                  <div className="p-3 bg-[#f2f3ff] rounded-xl flex gap-4">
                    <div className="flex-1 space-y-1.5"><div className="h-2.5 bg-slate-200 rounded w-14" /><div className="h-5 bg-slate-300 rounded w-16" /></div>
                    <div className="flex-1 space-y-1.5"><div className="h-2.5 bg-slate-200 rounded w-14" /><div className="h-5 bg-slate-300 rounded w-16" /></div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">{[1, 2, 3].map(t => <div key={t} className="h-6 w-16 bg-slate-100 rounded-md" />)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : dbProjects.length === 0 ? (
          <motion.div
            className="text-center py-20 bg-white rounded-2xl border border-black/5 max-w-lg mx-auto p-8 shadow-xs"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2 block">folder_off</span>
            <h3 className="text-lg font-bold text-[#171b26]">No Projects Available</h3>
            <p className="text-sm text-[#424656] mt-1">There are currently no case studies published.</p>
          </motion.div>
        ) : (
          <ProjectsGrid projects={dbProjects} />
        )}
      </main>

      <EngineeringLifecycle />
    </div>
  );
}