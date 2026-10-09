import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img src="/favicon.svg" alt="Olinethra Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[18px] tracking-tight text-[#171b26] group-hover:text-[#004fcb] transition-colors">
                    OLINETHRA
                  </span>
                </div>
              </Link>
            </div>
            <p className="text-[14px] text-[#424656] max-w-sm">
              High-performance distributed systems, low-latency microservices, and specialized autonomous AI agents engineered for enterprise-grade workloads.
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-2 text-[14px]">
            <h3 className="font-bold text-[#171b26] uppercase text-[12px] tracking-wider mb-2">Solutions</h3>
            <span className="text-[#424656] hover:text-[#004fcb] cursor-pointer">Autonomous Agents</span>
            <span className="text-[#424656] hover:text-[#004fcb] cursor-pointer">Distributed Pipelines</span>
            <span className="text-[#424656] hover:text-[#004fcb] cursor-pointer">Neural Search Engines</span>
            <span className="text-[#424656] hover:text-[#004fcb] cursor-pointer">Edge AI Deployment</span>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-2 text-[14px]">
            <h3 className="font-bold text-[#171b26] uppercase text-[12px] tracking-wider mb-2">Navigation</h3>
            <Link to="/services" className="text-[#424656] hover:text-[#004fcb]">Services</Link>
            <Link to="/projects" className="text-[#424656] hover:text-[#004fcb]">Projects</Link>
            <Link to="/contact" className="text-[#424656] hover:text-[#004fcb]">Contact</Link>
            <Link to="/admin" className="text-[#424656] hover:text-[#004fcb]">Admin Desk</Link>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <h3 className="font-bold text-[#171b26] uppercase text-[12px] tracking-wider">Engineering Briefing</h3>
            <p className="text-[14px] text-[#424656]">Receive bi-weekly architectural dispatches covering production AI workloads and system design.</p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="engineer@domain.com"
                className="flex-1 px-3 py-2.5 rounded-lg bg-[#f2f3ff] text-[14px] border-none outline-none min-w-0"
              />
              <button className="px-4 py-2.5 rounded-lg bg-[#004fcb] text-white text-[14px] font-semibold hover:bg-[#0265ff] transition-colors shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/5 text-[13px] text-[#424656]">
          <span>© 2025 Olinethra Technologies Inc. All systems verified and reserved.</span>
          <div className="flex gap-4 font-mono text-[12px]">
            <span>Privacy Protocol</span>
            <span>Service SLA</span>
            <span>API Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}