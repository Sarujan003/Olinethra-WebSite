import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "", email: "", company: "", website: "",
    scope: "Platform from Scratch", budget: "$50k - $100k", brief: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [chatMessages, setChatMessages] = useState([{
    sender: "agent",
    text: "Greetings. I am Olinethra's pre-brief agent. You can ask me about team availability, multi-region Kubernetes stacks, or typical engagement sprint horizons."
  }]);
  const [chatInput, setChatInput] = useState("");

  const handleBriefSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) setDone(true);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: q }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: "agent",
        text: `Analysis complete for: "${q.slice(0, 32)}...". Our engineering directors currently have 2 sprint slots available for Q2. Complete the form above to lock in an architectural triage session under mutual NDA.`
      }]);
    }, 500);
  };

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      {/* Dot-grid */}
      <div className="fixed inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(circle, rgba(31,75,224,0.1) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />

      <main className="relative pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <RevealSection className="mb-10">
          <span className="text-[13px] font-mono font-bold uppercase tracking-wider text-[#1F4BE0] block mb-3">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-1">
            Let's Build Something <span className="text-[#1F4BE0]">Exceptional</span>{" "}
            <span className="text-[#EA580C]">Together</span>
          </h1>
          <p className="text-[16px] text-[#424656] mt-2">
            Schedule a technical consultation with our engineering directors or submit detailed specifications.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <RevealSection delay={0.1} className="lg:col-span-5 flex flex-col gap-6">
            <motion.a
              href="https://wa.me/14155550192" target="_blank" rel="noreferrer"
              className="p-5 rounded-xl bg-white shadow-sm border border-[#E4E8F0] flex items-center justify-between"
              whileHover={{ y: -3, boxShadow: "0 12px 24px -12px rgba(11,16,32,.18)", borderColor: "#C9D0E2" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EA580C] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">forum</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[16px]">Direct Line</span>
                    <span className="px-2 py-0.5 rounded bg-[#ffdbcd] text-[#a33e00] text-[11px] font-bold">15 min avg</span>
                  </div>
                  <span className="text-[13px] text-[#424656]">Chat on WhatsApp: +1 415 555 0192</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#EA580C]">arrow_forward</span>
            </motion.a>

            <motion.div
              className="p-6 rounded-xl bg-white shadow-sm border border-[#E4E8F0] flex flex-col gap-3"
              whileHover={{ borderColor: "#C9D0E2" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[12px] font-mono font-bold text-[#1F4BE0] uppercase">Global Engineering Hubs</span>
              <div className="space-y-2 text-[14px]">
                {[["San Francisco (HQ)", "PST (UTC-8)"], ["London Hub", "GMT (UTC+0)"], ["Singapore Node", "SGT (UTC+8)"]].map(([city, tz]) => (
                  <div key={city} className="flex justify-between p-2 rounded bg-[#f2f3ff]">
                    <span>{city}</span>
                    <span className="font-mono text-[12px] text-[#424656]">{tz}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </RevealSection>

          {/* Right Column: Form */}
          <RevealSection delay={0.18} className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#E4E8F0]">
            <h2 className="text-xl font-bold mb-1">Production Project Brief</h2>
            {done ? (
              <div className="p-6 rounded-xl bg-green-50 border border-green-200 text-green-800">
                <h3 className="font-bold text-lg mb-1">Brief Transmitted Successfully (#INQ-9482)</h3>
                <p className="text-sm">Your requirements have been securely ingested. An engineering director will reach out within 24 business hours with an executed NDA.</p>
              </div>
            ) : (
              <form onSubmit={handleBriefSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Full Name *</label>
                    <input required type="text" className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30"
                      placeholder="Dr. Elena Vance" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Work Email *</label>
                    <input required type="email" className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30"
                      placeholder="e.vance@blackmesa.ai" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Company / Organization *</label>
                    <input required type="text" className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30"
                      placeholder="Synthetix Dynamics" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Website URL</label>
                    <input type="url" className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30"
                      placeholder="https://synthetix.io" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Capital Allocation (USD Budget Range)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["$25k - $50k", "$50k - $100k", "$100k+"].map(b => (
                      <button type="button" key={b} onClick={() => setForm({ ...form, budget: b })}
                        className={`py-2 rounded-lg text-[13px] font-semibold transition-all ${form.budget === b ? "bg-[#1F4BE0] text-white" : "bg-[#f2f3ff] text-[#424656]"}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Technical Specifications &amp; Constraints *</label>
                  <textarea required rows={4} className="w-full p-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30"
                    placeholder="Detail throughput targets, tech stack requirements, and latency SLAs..." value={form.brief}
                    onChange={e => setForm({ ...form, brief: e.target.value })} />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#1F4BE0] text-white font-semibold text-[14px] hover:bg-[#1A3FC4] transition-all relative overflow-hidden group">
                  <span className="relative z-10">{submitting ? "Encrypting & Ingesting..." : "Submit Technical Brief"}</span>
                </button>
              </form>
            )}
          </RevealSection>
        </div>

        {/* Pre-Brief Agent Widget */}
        <RevealSection delay={0.1} className="mt-12 p-6 rounded-2xl bg-white border border-[#E4E8F0] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1F4BE0] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px]">Live Autonomous Pre-Brief Agent</h3>
              <p className="text-[12px] text-[#424656]">Query team capacity, tech stack compatibilities, and engagement rates</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#f2f3ff] min-h-40 max-h-60 overflow-y-auto space-y-3">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-xl text-[13px] max-w-xl ${m.sender === "user" ? "bg-[#1F4BE0] text-white" : "bg-white shadow-sm text-[#171b26]"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input type="text" className="flex-1 px-4 py-2 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30"
              placeholder="Ask anything about our stack or sprint availability..."
              value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendChat()} />
            <button onClick={handleSendChat} className="px-5 py-2 rounded-lg bg-[#1F4BE0] text-white font-semibold text-[13px] hover:bg-[#1A3FC4] transition-colors">Query</button>
          </div>
        </RevealSection>
      </main>
    </div>
  );
}