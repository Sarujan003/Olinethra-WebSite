import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8ff]/80 backdrop-blur-xl border-b border-black/5">
      <div className="h-20 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#004fcb] flex items-center justify-center shadow-[0_0_18px_rgba(2,101,255,0.35)]">
              <span className="material-symbols-outlined text-white text-[22px]">terminal</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[18px] tracking-tight text-[#171b26] group-hover:text-[#004fcb] transition-colors">
                OLINETHRA
              </span>
              <span className="text-[11px] text-[#006178] uppercase tracking-wider font-semibold -mt-1">
                Engineering &amp; AI
              </span>
            </div>
          </Link>
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f3ff] text-[12px] font-mono text-[#424656]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fe6a17] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fe6a17]"></span>
            </span>
            <span>API Operational v1</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[14px]">
          <Link to="/" className={`transition-colors ${isActive('/') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Home</Link>
          <Link to="/services" className={`transition-colors ${isActive('/services') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Services</Link>
          <Link to="/projects" className={`transition-colors ${isActive('/projects') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Projects</Link>
          <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Contact</Link>
          {/* <Link to="/admin" className={`transition-colors ${isActive('/admin') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Admin Portal</Link> */}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/contact" className="px-4 py-2 rounded-lg bg-[#fe6a17] text-white text-[14px] font-semibold shadow-md hover:opacity-90 transition-opacity">
            Schedule Consultation
          </Link>
        </div>
      </div>
    </header>
  );
}