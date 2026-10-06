import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    website: "",
    scope: "Platform from Scratch",
    budget: "$50k - $100k",
    brief: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Pre-brief AI Agent Simulator
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "agent",
      text: "Greetings. I am Olinethra's pre-brief agent. You can ask me about team availability, multi-region Kubernetes stacks, or typical engagement sprint horizons."
    }
  ]);
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
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: q }]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: "agent",
          text: `Analysis complete for: "${q.slice(0, 32)}...". Our engineering directors currently have 2 sprint slots available for Q2. Complete the form above to lock in an architectural triage session under mutual NDA.`
        }
      ]);
    }, 500);
  };

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <span className="text-[12px] font-mono text-[#004fcb] uppercase font-bold">
            ENDPOINT: /api/v1/inquiries • Enterprise Engagement Desk
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-1">
            Let's Build Something <span className="text-[#004fcb]">Exceptional</span> Together
          </h1>
          <p className="text-[16px] text-[#424656] mt-2">
            Schedule a technical consultation with our engineering directors or submit detailed specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Hook & Global Nodes */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <a
              href="https://wa.me/14155550192"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-xl bg-white shadow-sm border border-black/5 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#fe6a17] text-white flex items-center justify-center">
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
              <span className="material-symbols-outlined text-[#fe6a17]">arrow_forward</span>
            </a>

            <div className="p-6 rounded-xl bg-white shadow-sm border border-black/5 flex flex-col gap-3">
              <span className="text-[12px] font-mono font-bold text-[#004fcb] uppercase">Global Engineering Hubs</span>
              <div className="space-y-2 text-[14px]">
                <div className="flex justify-between p-2 rounded bg-[#f2f3ff]">
                  <span>San Francisco (HQ)</span>
                  <span className="font-mono text-[12px] text-[#424656]">PST (UTC-8)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#f2f3ff]">
                  <span>London Hub</span>
                  <span className="font-mono text-[12px] text-[#424656]">GMT (UTC+0)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#f2f3ff]">
                  <span>Singapore Node</span>
                  <span className="font-mono text-[12px] text-[#424656]">SGT (UTC+8)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Brief Ingestion Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-black/5">
            <h2 className="text-xl font-bold mb-1">Production Project Brief</h2>
            <p className="text-[13px] text-[#424656] mb-6">POST /api/v1/inquiries — Ingestion pipeline</p>

            {done ? (
              <div className="p-6 rounded-xl bg-green-50 border border-green-200 text-green-800">
                <h3 className="font-bold text-lg mb-1">Brief Transmitted Successfully (#INQ-9482)</h3>
                <p className="text-sm">
                  Your requirements have been securely ingested. An engineering director will reach out within 24 business hours with an executed NDA.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBriefSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none"
                      placeholder="Dr. Elena Vance"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Work Email *</label>
                    <input
                      required
                      type="email"
                      className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none"
                      placeholder="e.vance@blackmesa.ai"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Company / Organization *</label>
                    <input
                      required
                      type="text"
                      className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none"
                      placeholder="Synthetix Dynamics"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Website URL</label>
                    <input
                      type="url"
                      className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none"
                      placeholder="https://synthetix.io"
                      value={form.website}
                      onChange={e => setForm({ ...form, website: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-1">Capital Allocation (USD Budget Range)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["$25k - $50k", "$50k - $100k", "$100k+"].map(b => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setForm({ ...form, budget: b })}
                        className={`py-2 rounded-lg text-[13px] font-semibold transition-all ${
                          form.budget === b ? "bg-[#004fcb] text-white" : "bg-[#f2f3ff] text-[#424656]"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-1">Technical Specifications &amp; Constraints *</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full p-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none"
                    placeholder="Detail throughput targets, tech stack requirements, and latency SLAs..."
                    value={form.brief}
                    onChange={e => setForm({ ...form, brief: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#004fcb] text-white font-semibold text-[14px] hover:bg-[#0265ff] transition-all"
                >
                  {submitting ? "Encrypting & Ingesting..." : "Submit Technical Brief"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Pre-Brief Agent Widget */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#0265ff] text-white flex items-center justify-center">
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
                <div className={`p-3 rounded-xl text-[13px] max-w-xl ${m.sender === "user" ? "bg-[#004fcb] text-white" : "bg-white shadow-sm text-[#171b26]"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-lg bg-[#f2f3ff] text-[14px] outline-none"
              placeholder="Ask anything about our stack or sprint availability..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendChat()}
            />
            <button onClick={handleSendChat} className="px-5 py-2 rounded-lg bg-[#004fcb] text-white font-semibold text-[13px]">
              Query
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}