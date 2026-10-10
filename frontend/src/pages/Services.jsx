import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

const STATIC_PILLARS = [];
const FILTER_TABS = [
  { id: "all", label: "All Disciplines" },
  { id: "frontend", label: "Frontend / React" },
  { id: "backend", label: "Cloud Systems" },
  { id: "ai", label: "Applied AI" },
  { id: "sre", label: "SRE & DevOps" },
];

/* Shared animation variants */
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

function ServicesGrid({ pillars }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {pillars.map((p, idx) => (
        <motion.div
          key={p.id || idx}
          className="bg-white p-6 rounded-xl border border-[#E4E8F0] shadow-sm flex flex-col justify-between"
          variants={cardVariant}
          whileHover={{ y: -4, boxShadow: "0 16px 30px -18px rgba(11,16,32,.28)", borderColor: "#C9D0E2" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div>
            {p.id_code && (
              <span className="text-[11px] font-mono text-[#424656] bg-[#f2f3ff] px-2 py-0.5 rounded">
                {p.id_code}
              </span>
            )}
            <h3 className="text-xl font-bold mt-2 text-[#171b26]">{p.title}</h3>
            <p className="text-[14px] text-[#424656] mt-2 leading-relaxed">{p.desc}</p>
            {p.caps && p.caps.length > 0 && (
              <div className="mt-4">
                <span className="text-[12px] font-bold uppercase text-slate-500">Core Capabilities</span>
                <ul className="grid grid-cols-2 gap-2 mt-2 text-[13px] text-[#424656]">
                  {p.caps.map((cap, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#1F4BE0]">check_circle</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {p.deliverables && p.deliverables.length > 0 && (
            <div className="mt-6 pt-4 border-t border-black/5 flex flex-wrap gap-2">
              {p.deliverables.map((deliv, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-[#ebedfc] text-[11px] font-mono text-[#1F4BE0]">
                  {deliv}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Services() {
  const [activePillar, setActivePillar] = useState("all");
  const [archType, setArchType] = useState("fullstack");
  const [sprintCount, setSprintCount] = useState(8);
  const [secTier, setSecTier] = useState("soc2");
  const [pillars, setPillars] = useState(STATIC_PILLARS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => { };
    try {
      const q = query(collection(db, "services"), orderBy("createdAt"));
      unsub = onSnapshot(q,
        snap => { setPillars(snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
        () => setLoading(false)
      );
    } catch { setLoading(false); }
    return () => unsub();
  }, []);

  const filteredPillars = activePillar === "all" ? pillars : pillars.filter(p => p.category === activePillar);
  const currentTabLabel = FILTER_TABS.find(t => t.id === activePillar)?.label || activePillar;

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      {/* Subtle dot-grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(circle, rgba(31,75,224,0.1) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />

      <main className="relative pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        {/* Page header */}
        <RevealSection className="flex flex-col gap-3 mb-12">
          <span className="text-[13px] font-mono font-bold uppercase tracking-wider text-[#1F4BE0]">
            What We Build
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            End-to-End Engineering &amp;{" "}
            <span className="text-[#7C3AED]">Modern Software</span> Capabilities
          </h1>
          <p className="text-[16px] text-[#424656] max-w-3xl">
            From architectural blueprint to global production scale, we design, build, and deploy resilient digital software products engineered for zero compromise.
          </p>
        </RevealSection>

        {/* Filter Tabs */}
        <RevealSection delay={0.1} className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePillar(tab.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${activePillar === tab.id
                ? "bg-[#1F4BE0] text-white shadow-sm"
                : "bg-white text-[#424656] border border-black/5 hover:border-black/20"}`}
            >
              {tab.label}
            </button>
          ))}
        </RevealSection>

        {/* Services Grid */}
        <div className="mb-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white p-6 rounded-xl border border-black/5 shadow-sm animate-pulse flex flex-col justify-between min-h-[320px]">
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="space-y-2"><div className="h-4 bg-slate-100 rounded w-full" /><div className="h-4 bg-slate-100 rounded w-5/6" /></div>
                    <div className="pt-4 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-28" />
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map(x => <div key={x} className="h-4 bg-slate-100 rounded" />)}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-black/5 flex gap-2">
                    <div className="h-5 bg-slate-200 rounded w-16" />
                    <div className="h-5 bg-slate-200 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPillars.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#f2f3ff] text-[#1F4BE0] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">search_off</span>
              </div>
              <h3 className="text-xl font-bold text-[#171b26] mb-2">No Services Found</h3>
              <p className="text-[14px] text-[#424656] mb-6 max-w-md leading-relaxed">
                {activePillar === "all" ? "No service records have been added yet." : `No capabilities listed under "${currentTabLabel}".`}
              </p>
              {activePillar !== "all" && (
                <button onClick={() => setActivePillar("all")} className="px-5 py-2.5 rounded-lg bg-[#ebedfc] text-[#1F4BE0] font-semibold text-[13px] hover:bg-[#dfe2f1] transition-colors">
                  View All Disciplines
                </button>
              )}
            </div>
          ) : (
            <ServicesGrid pillars={filteredPillars} />
          )}
        </div>

        {/* Scope & Cost Estimator */}
        <RevealSection delay={0.05}>
          <div className="p-8 rounded-2xl bg-white border border-[#E4E8F0] shadow-sm">
            <div className="mb-6">
              <span className="text-[12px] font-mono text-[#1F4BE0] font-bold uppercase">Dynamic Planner</span>
              <h2 className="text-2xl font-bold">Interactive Resource &amp; Scope Estimator</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold mb-2 uppercase">1. System Architecture Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "frontend", title: "Frontend / React", desc: "Design tokens & client app" },
                      { id: "fullstack", title: "Fullstack Cloud", desc: "React + Go/Node microservices" },
                      { id: "ai_cloud", title: "AI Core & Mesh", desc: "LLM, vector stores, autonomous loops" }
                    ].map(item => (
                      <button key={item.id} onClick={() => setArchType(item.id)}
                        className={`p-3 rounded-lg text-left transition-all ${archType === item.id ? "bg-[#ebedfc] border-2 border-[#1F4BE0]" : "bg-[#f2f3ff]"}`}>
                        <span className="font-bold text-[13px] block">{item.title}</span>
                        <span className="text-[11px] text-[#424656]">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-bold mb-2">
                    <span>2. Target Delivery Horizon</span>
                    <span className="text-[#1F4BE0] font-mono">{sprintCount} Sprints ({sprintCount * 2} Weeks)</span>
                  </div>
                  <input type="range" min="4" max="16" step="2" value={sprintCount}
                    onChange={e => setSprintCount(Number(e.target.value))} className="w-full accent-[#1F4BE0]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-2 uppercase">3. Security Posture</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "baseline", title: "Standard Cloud", desc: "OWASP & TLS 1.3" },
                      { id: "soc2", title: "SOC-2 Type II", desc: "Audit trails & Zero-Trust" },
                      { id: "hipaa", title: "HIPAA / FinTech", desc: "HSM encrypted VPCs" }
                    ].map(sec => (
                      <button key={sec.id} onClick={() => setSecTier(sec.id)}
                        className={`p-3 rounded-lg text-left transition-all ${secTier === sec.id ? "bg-[#ebedfc] border-2 border-[#1F4BE0]" : "bg-[#f2f3ff]"}`}>
                        <span className="font-bold text-[13px] block">{sec.title}</span>
                        <span className="text-[11px] text-[#424656]">{sec.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 bg-[#f2f3ff] p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[12px] font-mono uppercase text-[#424656]">Scope Telemetry Result</span>
                  <div className="text-3xl font-extrabold text-[#171b26] mt-1">{sprintCount} Sprints</div>
                  <p className="text-[12px] font-mono text-[#1F4BE0] mt-1">Pod: 1 Principal Architect, 2 Senior Engineers, 1 DevOps Lead</p>
                  <div className="mt-6 space-y-2 text-[13px]">
                    <div className="flex justify-between py-1 border-b border-black/5"><span>Architecture RFC Sign-off:</span><strong className="font-mono">Sprint 1 - 2</strong></div>
                    <div className="flex justify-between py-1 border-b border-black/5"><span>Production Target:</span><strong className="font-mono">Sprint {sprintCount} Delivery</strong></div>
                    <div className="flex justify-between py-1 border-b border-black/5"><span>Availability Guarantee:</span><strong className="font-mono text-[#1F4BE0]">99.995% Uptime</strong></div>
                  </div>
                </div>
                <Link to="/contact" className="mt-6 w-full py-3 bg-[#EA580C] text-white font-bold rounded-lg text-center shadow-md hover:opacity-90 block">
                  Inquire With This Scope
                </Link>
              </div>
            </div>
          </div>
        </RevealSection>
      </main>
    </div>
  );
}