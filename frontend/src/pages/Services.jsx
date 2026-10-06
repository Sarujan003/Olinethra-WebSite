import { useState } from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const [activePillar, setActivePillar] = useState("all");
  const [archType, setArchType] = useState("fullstack");
  const [sprintCount, setSprintCount] = useState(8);
  const [secTier, setSecTier] = useState("soc2");

  const pillars = [
    {
      id: "SYS.01 // WEB_RUNTIME",
      category: "frontend",
      title: "React & Modern Frontend Architecture",
      desc: "Ultra-responsive enterprise interfaces built on React Server Components, zero-waterfall data fetching pipelines, and automated sub-second Core Web Vitals.",
      caps: ["Server Actions & React 19", "Micro-frontend dynamic federation", "Core Web Vitals < 0.8s", "WCAG 2.1 AAA accessibility"],
      deliverables: ["Production SPA", "Design Token Library", "Playwright E2E"]
    },
    {
      id: "SYS.02 // DISTRIB_SVC",
      category: "backend",
      title: "Custom Cloud & Distributed Backend Systems",
      desc: "High-concurrency microservices, multi-region distributed databases, and event streams engineered for millions of requests per second.",
      caps: ["Kubernetes Mesh Orchestration", "Kafka & Serverless Event Buses", "Go & Rust daemons", "Postgres / Citus sharding"],
      deliverables: ["Multi-Region Infra", "GitOps CI/CD", "Datadog Dashboards"]
    },
    {
      id: "SYS.03 // COGNITIVE_AI",
      category: "ai",
      title: "Applied AI & Machine Learning Systems",
      desc: "Domain-specific neural pipelines, localized retrieval-augmented generation (RAG), and autonomous multi-agent systems built directly into workflows.",
      caps: ["Domain LLM Fine-Tuning", "Vector Stores (Milvus/Pinecone)", "Hybrid BM25 + Dense RAG", "Autonomous Orchestrators"],
      deliverables: ["Private LLM Gateway", "Embeddings Ingestion", "Guardrail Matrix"]
    },
    {
      id: "SYS.04 // RESILIENCE",
      category: "sre",
      title: "DevOps, Security & Site Reliability Engineering",
      desc: "Hardened infrastructure posture adhering to Zero-Trust principles, automated disaster recovery simulations, and 24/7 proactive incident response.",
      caps: ["Zero-Trust IAM Policies", "SOC-2 Type II Readiness", "Chaos Engineering Experiments", "Automated Pen-Testing"],
      deliverables: ["Disaster Recovery Runbook", "Automated Rollback Engine", "Terraform Modules"]
    }
  ];

  const filteredPillars = activePillar === "all" ? pillars : pillars.filter(p => p.category === activePillar);

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-3 mb-12">
          <span className="text-[12px] font-mono text-[#004fcb] uppercase font-bold tracking-wider">
            GET /api/v1/services — Ready (14ms latency)
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            End-to-End Engineering &amp; Modern Software Capabilities
          </h1>
          <p className="text-[16px] text-[#424656] max-w-3xl">
            From architectural blueprint to global production scale, we design, build, and deploy resilient digital software products engineered for zero compromise.
          </p>
        </div>

        {/* Pillars Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All Disciplines" },
            { id: "frontend", label: "Frontend / React" },
            { id: "backend", label: "Cloud Systems" },
            { id: "ai", label: "Applied AI" },
            { id: "sre", label: "SRE & DevOps" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePillar(tab.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                activePillar === tab.id ? "bg-[#004fcb] text-white" : "bg-white text-[#424656] border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {filteredPillars.map((p, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-black/5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#424656] bg-[#f2f3ff] px-2 py-0.5 rounded">{p.id}</span>
                <h3 className="text-xl font-bold mt-2 text-[#171b26]">{p.title}</h3>
                <p className="text-[14px] text-[#424656] mt-2">{p.desc}</p>

                <div className="mt-4">
                  <span className="text-[12px] font-bold uppercase text-slate-500">Core Capabilities</span>
                  <ul className="grid grid-cols-2 gap-2 mt-2 text-[13px] text-[#424656]">
                    {p.caps.map((cap, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#004fcb]">check_circle</span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex flex-wrap gap-2">
                {p.deliverables.map((deliv, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#ebedfc] text-[11px] font-mono text-[#004fcb]">
                    {deliv}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scope & Cost Estimator */}
        <div className="p-8 rounded-2xl bg-white border border-black/5 shadow-sm">
          <div className="mb-6">
            <span className="text-[12px] font-mono text-[#004fcb] font-bold uppercase">Dynamic Planner</span>
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
                    <button
                      key={item.id}
                      onClick={() => setArchType(item.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        archType === item.id ? "bg-[#ebedfc] border-2 border-[#004fcb]" : "bg-[#f2f3ff]"
                      }`}
                    >
                      <span className="font-bold text-[13px] block">{item.title}</span>
                      <span className="text-[11px] text-[#424656]">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] font-bold mb-2">
                  <span>2. Target Delivery Horizon</span>
                  <span className="text-[#004fcb] font-mono">{sprintCount} Sprints ({sprintCount * 2} Weeks)</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="2"
                  value={sprintCount}
                  onChange={e => setSprintCount(Number(e.target.value))}
                  className="w-full accent-[#004fcb]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold mb-2 uppercase">3. Security Posture</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "baseline", title: "Standard Cloud", desc: "OWASP & TLS 1.3" },
                    { id: "soc2", title: "SOC-2 Type II", desc: "Audit trails & Zero-Trust" },
                    { id: "hipaa", title: "HIPAA / FinTech", desc: "HSM encrypted VPCs" }
                  ].map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => setSecTier(sec.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        secTier === sec.id ? "bg-[#ebedfc] border-2 border-[#004fcb]" : "bg-[#f2f3ff]"
                      }`}
                    >
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
                <p className="text-[12px] font-mono text-[#004fcb] mt-1">
                  Pod: 1 Principal Architect, 2 Senior Engineers, 1 DevOps Lead
                </p>

                <div className="mt-6 space-y-2 text-[13px]">
                  <div className="flex justify-between py-1 border-b border-black/5">
                    <span>Architecture RFC Sign-off:</span>
                    <strong className="font-mono">Sprint 1 - 2</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-black/5">
                    <span>Production Target:</span>
                    <strong className="font-mono">Sprint {sprintCount} Delivery</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-black/5">
                    <span>Availability Guarantee:</span>
                    <strong className="font-mono text-[#004fcb]">99.995% Uptime</strong>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="mt-6 w-full py-3 bg-[#fe6a17] text-white font-bold rounded-lg text-center shadow-md hover:opacity-90 block"
              >
                Inquire With This Scope
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}