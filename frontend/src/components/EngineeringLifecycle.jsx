const PHASES = [
    {
        number: "01",
        duration: "1-2 sprints",
        phase: "PHASE 01",
        title: "Discovery & Spike",
        desc: "Deep audits of current topology, latency bottlenecks, and compliance needs. Proof-of-concept spikes validate core assumptions.",
        output: "Risk matrix & PoC",
        color: "#004fcb",
    },
    {
        number: "02",
        duration: "1 sprint",
        phase: "PHASE 02",
        title: "Architecture Blueprint",
        desc: "High-fidelity system specs, sequence diagrams, schema mapping, and Terraform infrastructure plans signed off by stakeholders.",
        output: "ADRs & specifications",
        color: "#004fcb",
    },
    {
        number: "03",
        duration: "4-12 sprints",
        phase: "PHASE 03",
        title: "Iterative Engineering",
        desc: "Two-week sprints with continuous integration. Every pull request passes automated testing, profiling, and security scanning.",
        output: "Sprint review demos",
        color: "#004fcb",
    },
    {
        number: "04",
        duration: "Ongoing",
        phase: "PHASE 04",
        title: "Deploy & Scale",
        desc: "Phased rollouts with canary deployments, load stress testing, observability tuning, and 24/7 incident monitoring.",
        output: "SLA in effect",
        color: "#fe6a17",
    },
];

export default function EngineeringLifecycle() {
    return (
        <section className="bg-[#eef0fb] py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <span className="inline-block px-3 py-1 rounded-full bg-white border border-black/10 text-[11px] font-mono font-bold uppercase tracking-widest text-[#171b26] mb-4">
                        Engineering Lifecycle
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#171b26] tracking-tight leading-tight mb-3">
                        A rigorous, metrics-driven delivery workflow
                    </h2>
                    <p className="text-[16px] text-[#424656] max-w-2xl leading-relaxed">
                        Deep architecture validation, continuous integration, and progressive rollout patterns that minimize technical risk.
                    </p>
                </div>

                {/* Phase Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {PHASES.map((p) => (
                        <div
                            key={p.number}
                            className="bg-white rounded-2xl p-6 border border-black/5 shadow-xs flex flex-col gap-4 hover:shadow-md transition-shadow"
                        >
                            {/* Top Row: Number Badge + Duration */}
                            <div className="flex items-center justify-between">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-[13px] shrink-0"
                                    style={{ background: p.color }}
                                >
                                    {p.number}
                                </div>
                                <span className="text-[12px] font-mono text-[#424656]">{p.duration}</span>
                            </div>

                            {/* Phase Label + Title */}
                            <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#004fcb] block mb-1">
                                    {p.phase}
                                </span>
                                <h3 className="text-[18px] font-extrabold text-[#171b26] leading-snug">{p.title}</h3>
                            </div>

                            {/* Description */}
                            <p className="text-[13px] text-[#424656] leading-relaxed flex-1">{p.desc}</p>

                            {/* Output Tag */}
                            <div className="pt-2 border-t border-black/5">
                                <span className="inline-block px-3 py-1.5 rounded-lg bg-[#f2f3ff] text-[#424656] text-[11px] font-mono font-semibold">
                                    Output: {p.output}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
