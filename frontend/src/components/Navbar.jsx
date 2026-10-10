import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { usePreloader } from "../context/PreloaderContext";

export default function Navbar() {
  const location = useLocation();
  const { preloaderDone } = usePreloader();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === "/";

  // On home: navbar drops in after preloader. On all other routes: visible instantly.
  const navVariants = isHome
    ? {
      hidden: { y: "-100%", opacity: 0 },
      visible: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } },
    }
    : { visible: { y: "0%", opacity: 1 } };
  const animateState = isHome ? (preloaderDone ? "visible" : "hidden") : "visible";

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* Navbar Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-[#faf8ff]/90 backdrop-blur-xl border-b border-black/5"
        variants={navVariants}
        initial={isHome ? "hidden" : "visible"}
        animate={animateState}
      >
        <div className="h-20 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src="/favicon.svg" alt="Olinethra Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] sm:text-[18px] tracking-tight text-[#171b26] group-hover:text-[#004fcb] transition-colors">
                OLINETHRA
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#006178] uppercase tracking-wider font-semibold -mt-1">
                Engineering &amp; AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px]">
            <Link to="/" className={`transition-colors ${isActive('/') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Home</Link>
            <Link to="/services" className={`transition-colors ${isActive('/services') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Services</Link>
            <Link to="/projects" className={`transition-colors ${isActive('/projects') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Projects</Link>
            <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-[#004fcb] font-bold' : 'text-[#424656] hover:text-[#171b26]'}`}>Contact</Link>
          </nav>

          {/* Desktop CTA + Mobile Hamburger (right-aligned) */}
          <div className="flex items-center gap-3">
            <Link
              to="/schedule"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-[#fe6a17] text-white text-[14px] font-semibold shadow-md hover:opacity-90 transition-opacity"
            >
              Schedule Consultation
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl text-[#171b26] hover:text-[#004fcb] hover:bg-[#ebedfc] transition-colors cursor-pointer flex items-center justify-center border border-black/5 bg-white shadow-xs"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-Screen Mobile Navigation Overlay — OUTSIDE header, covers full viewport */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden bg-[#faf8ff] flex flex-col overflow-y-auto">
          {/* Overlay Top Bar */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-black/5 shrink-0">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
              <img src="/favicon.svg" alt="Olinethra Logo" className="w-9 h-9 object-contain" />
              <div className="flex flex-col">
                <span className="font-extrabold text-[17px] tracking-tight text-[#171b26]">OLINETHRA</span>
                <span className="text-[10px] text-[#006178] uppercase tracking-wider font-semibold -mt-1">
                  Engineering &amp; AI
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-xl bg-white border border-black/10 text-[#171b26] flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-all"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 py-8 gap-6">
            <nav className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/projects", label: "Projects" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-5 py-4 rounded-2xl text-[18px] font-bold flex items-center justify-between transition-all ${isActive(to)
                    ? "bg-[#004fcb] text-white shadow-md"
                    : "bg-white text-[#171b26] border border-black/5 hover:bg-slate-50"
                    }`}
                >
                  <span>{label}</span>
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom CTA */}
          <div className="px-6 sm:px-8 pb-10 pt-4 border-t border-black/5 shrink-0 flex flex-col gap-3">
            <Link
              to="/schedule"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 px-6 rounded-2xl bg-[#fe6a17] hover:bg-[#ff7a2d] text-white text-[16px] font-extrabold shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
              <span>Schedule Consultation</span>
            </Link>
            <p className="text-[12px] text-center text-slate-400 font-mono">
              Olinethra Enterprise Systems &amp; AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}