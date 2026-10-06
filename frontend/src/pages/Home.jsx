import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [terminalTab, setTerminalTab] = useState("health");

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pb-16 pt-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebedfc] text-[12px] font-mono font-semibold text-[#171b26]">
              <span className="w-2 h-2 rounded-full bg-[#fe6a17] animate-pulse"></span>
              ENTERPRISE CLOUD ARCHITECTURE &amp; AI RUNTIME
            </span>
            <span className="hidden sm:inline text-[12px] font-mono text-slate-400">v2.4.0-stable</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Engineering Scalable Software &amp;{" "}
                <span className="bg-linear-to-r from-[#004fcb] to-[#fe6a17] bg-clip-text text-transparent">
                  Intelligent Cloud Systems
                </span>{" "}
                for Ambitious Brands
              </h1>
              <p className="text-[18px] text-[#424656] max-w-2xl leading-relaxed">
                We architect next-generation web platforms, enterprise AI solutions, and distributed systems with uncompromising speed, security, and precision. Built for 99.999% reliability under extreme load.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/services" className="px-6 py-3 rounded-lg bg-[#004fcb] text-white font-semibold text-[14px] shadow-lg hover:bg-[#0265ff] transition-all flex items-center gap-2">
                  <span>Explore Services</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link to="/projects" className="px-6 py-3 rounded-lg bg-[#ebedfc] text-[#171b26] font-semibold text-[14px] hover:bg-[#dfe2f1] transition-colors flex items-center gap-2">
                  <span>View Case Studies</span>
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap gap-6 text-[13px] text-[#424656]">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#004fcb] text-[18px]">verified</span>
                  SOC-2 Type II Certified
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#fe6a17] text-[18px]">bolt</span>
                  &lt;250ms Global P99
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#006178] text-[18px]">cloud_sync</span>
                  40+ Multi-Region Nodes
                </span>
              </div>
            </div>

            {/* Right: Terminal Telemetry Visualizer */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-white shadow-xl border border-black/5 overflow-hidden p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 bg-[#f2f3ff] px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#424656]">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                    <span className="ml-2">edge-us-east-1.olinethra.internal</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#004fcb] font-bold">
                    STATUS: 200 OK
                  </span>
                </div>

                <div className="flex gap-2 bg-[#ebedfc] p-1 rounded-lg">
                  <button
                    onClick={() => setTerminalTab("health")}
                    className={`flex-1 py-1 text-[12px] font-mono font-bold rounded transition-all ${
                      terminalTab === "health" ? "bg-white text-[#004fcb] shadow-sm" : "text-[#424656]"
                    }`}
                  >
                    GET /api/v1/health
                  </button>
                  <button
                    onClick={() => setTerminalTab("services")}
                    className={`flex-1 py-1 text-[12px] font-mono font-bold rounded transition-all ${
                      terminalTab === "services" ? "bg-white text-[#004fcb] shadow-sm" : "text-[#424656]"
                    }`}
                  >
                    GET /api/v1/services
                  </button>
                </div>

                <div className="p-3 bg-[#faf8ff] rounded-lg font-mono text-[12px] min-h-42.5">
                  {terminalTab === "health" ? (
                    <div>
                      {"{"}<br />
                      &nbsp;&nbsp;<span className="text-[#004fcb]">"status"</span>: <span className="text-[#006178]">"healthy"</span>,<br />
                      &nbsp;&nbsp;<span className="text-[#004fcb]">"cluster_runtime"</span>: <span className="text-[#fe6a17]">"k8s-v1.31.2-arm64"</span>,<br />
                      &nbsp;&nbsp;<span className="text-[#004fcb]">"active_nodes"</span>: 48,<br />
                      &nbsp;&nbsp;<span className="text-[#004fcb]">"p99_latency"</span>: <span className="text-[#006178]">"18.4ms"</span>,<br />
                      &nbsp;&nbsp;<span className="text-[#004fcb]">"sla_adherence"</span>: <span className="text-[#006178]">"99.999%"</span><br />
                      {"}"}
                    </div>
                  ) : (
                    <div>
                      [<br />
                      &nbsp;&nbsp;<span className="text-[#004fcb]">"fullstack_edge"</span>: {"{"} <span className="text-slate-400">"runtime"</span>: <span className="text-[#006178]">"React 19 Vite"</span> {"}"},<br />
                      &nbsp;&nbsp;<span className="text-[#004fcb]">"cloud_mesh"</span>: {"{"} <span className="text-slate-400">"orchestrator"</span>: <span className="text-[#006178]">"Terraform Multi-Cloud"</span> {"}"},<br />
                      &nbsp;&nbsp;<span className="text-[#004fcb]">"ai_agentic_mesh"</span>: {"{"} <span className="text-slate-400">"rag_nodes"</span>: 12, <span className="text-slate-400">"throughput"</span>: <span className="text-[#fe6a17]">"840 req/s"</span> {"}"}<br />
                      ]
                    </div>
                  )}
                </div>

                <div className="bg-[#f2f3ff] rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-[#424656] block">Realtime P99 Telemetry</span>
                    <span className="text-[16px] font-bold text-[#171b26]">18.42 ms</span>
                  </div>
                  <div className="w-28 h-6">
                    <svg className="w-full h-full text-[#004fcb]" fill="none" viewBox="0 0 120 36">
                      <path d="M0 30 Q 15 12, 30 20 T 60 10 T 90 22 T 120 8" stroke="currentColor" strokeWidth="2.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[12px] font-mono text-[#424656] block mb-1">SERVICE GUARANTEE</span>
              <span className="text-3xl font-extrabold text-[#171b26]">99.99%</span>
              <span className="text-[13px] text-[#424656] block mt-1">Guaranteed SLA Uptime Target</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[12px] font-mono text-[#424656] block mb-1">EDGE DISPATCH</span>
              <span className="text-3xl font-extrabold text-[#fe6a17]">&lt;250ms</span>
              <span className="text-[13px] text-[#424656] block mt-1">Global P99 Worldwide Edge</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[12px] font-mono text-[#424656] block mb-1">DEPLOYMENTS</span>
              <span className="text-3xl font-extrabold text-[#171b26]">40+</span>
              <span className="text-[13px] text-[#424656] block mt-1">Fortune 1000 &amp; Scalers</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[12px] font-mono text-[#424656] block mb-1">COMPLIANCE</span>
              <span className="text-3xl font-extrabold text-[#171b26]">SOC-2</span>
              <span className="text-[13px] text-[#424656] block mt-1">Type II &amp; HIPAA Hardened</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="bg-[#f2f3ff] py-12 border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[12px] font-mono text-[#004fcb] font-bold uppercase">Core Infrastructure</span>
              <h2 className="text-2xl font-bold">Battle-Tested Modern Stack</h2>
            </div>
            <p className="text-[14px] text-[#424656]">Designed with zero legacy dependencies and clean architecture principles.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "React / Vite", sub: "Turbopack Bundler" },
              { label: "TypeScript", sub: "Strict Typing" },
              { label: "Rust", sub: "Zero-Cost Mem" },
              { label: "Golang", sub: "gRPC Services" },
              { label: "Python / PyTorch", sub: "LLM Pipelines" },
              { label: "Kubernetes", sub: "Multi-region mesh" }
            ].map((stack, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-black/5 shadow-sm">
                <span className="font-bold text-[14px] block">{stack.label}</span>
                <span className="text-[11px] font-mono text-slate-400">{stack.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}