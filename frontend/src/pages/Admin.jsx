import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [tab, setTab] = useState("projects");

  const [form, setForm] = useState({
    title: "",
    category: "fintech",
    client: "",
    tag: "",
    badge: "PROD-V1",
    summary: "",
    challenge: "",
    metric1_label: "Throughput",
    metric1_val: "+320%",
    metric2_label: "Latency",
    metric2_val: "0.8ms P99",
    technologies: "Go, Kafka, ClickHouse, Docker",
    image_url: ""
  });

  const fetchData = async () => {
    try {
      const pRes = await fetch("/api/projects");
      const pData = await pRes.json();
      if (pData.success) setProjects(pData.data);

      const iRes = await fetch("/api/inquiries");
      const iData = await iRes.json();
      if (iData.success) setInquiries(iData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      technologies: form.technologies.split(",").map(t => t.trim())
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Project added! It is now live on the company portal.");
        setForm({
          title: "",
          category: "fintech",
          client: "",
          tag: "",
          badge: "PROD-V1",
          summary: "",
          challenge: "",
          metric1_label: "Throughput",
          metric1_val: "+320%",
          metric2_label: "Latency",
          metric2_val: "0.8ms P99",
          technologies: "Go, Kafka, ClickHouse, Docker",
          image_url: ""
        });
        setTab("projects");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[12px] font-mono text-red-600 font-bold uppercase tracking-wider">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Olinethra Operations Mesh</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTab("projects")}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${
                tab === "projects" ? "bg-[#004fcb] text-white" : "bg-white border"
              }`}
            >
              Active Projects ({projects.length})
            </button>
            <button
              onClick={() => setTab("add")}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${
                tab === "add" ? "bg-[#004fcb] text-white" : "bg-white border"
              }`}
            >
              + Add New Project
            </button>
            <button
              onClick={() => setTab("inquiries")}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${
                tab === "inquiries" ? "bg-[#004fcb] text-white" : "bg-white border"
              }`}
            >
              Client Inquiries ({inquiries.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Live Projects List */}
        {tab === "projects" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Live Portal Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isAdmin={true}
                  onDelete={handleDelete}
                  onInspect={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Add Project Form */}
        {tab === "add" && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-black/5 max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Deploy New Project to Company Portal</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Project Title *</label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="FinScale Treasury Platform"
                    className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                  >
                    <option value="fintech">Fintech &amp; Web3</option>
                    <option value="ai">AI &amp; Machine Learning</option>
                    <option value="cloud">Cloud &amp; Infrastructure</option>
                    <option value="health">Healthcare Tech</option>
                    <option value="saas">Enterprise SaaS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Client Name</label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={e => setForm({ ...form, client: e.target.value })}
                    placeholder="FinScale Global Bank"
                    className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Tag / Compliance</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={e => setForm({ ...form, tag: e.target.value })}
                    placeholder="ISO 20022 Compliant"
                    className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1">System Badge</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={e => setForm({ ...form, badge: e.target.value })}
                    placeholder="GO-LEDGER-V3"
                    className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1">Executive Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  placeholder="Real-time settlement and automated double-entry ledger..."
                  className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1">Architecture Challenge</label>
                <textarea
                  rows={2}
                  value={form.challenge}
                  onChange={e => setForm({ ...form, challenge: e.target.value })}
                  placeholder="Eliminate 4hr legacy batch sync..."
                  className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold">KPI 1 Label</label>
                  <input
                    type="text"
                    value={form.metric1_label}
                    onChange={e => setForm({ ...form, metric1_label: e.target.value })}
                    className="w-full p-2 rounded bg-[#f2f3ff] text-[13px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold">KPI 1 Value</label>
                  <input
                    type="text"
                    value={form.metric1_val}
                    onChange={e => setForm({ ...form, metric1_val: e.target.value })}
                    className="w-full p-2 rounded bg-[#f2f3ff] text-[13px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold">KPI 2 Label</label>
                  <input
                    type="text"
                    value={form.metric2_label}
                    onChange={e => setForm({ ...form, metric2_label: e.target.value })}
                    className="w-full p-2 rounded bg-[#f2f3ff] text-[13px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold">KPI 2 Value</label>
                  <input
                    type="text"
                    value={form.metric2_val}
                    onChange={e => setForm({ ...form, metric2_val: e.target.value })}
                    className="w-full p-2 rounded bg-[#f2f3ff] text-[13px] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={e => setForm({ ...form, technologies: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded bg-[#f2f3ff] text-[14px] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#004fcb] text-white font-bold rounded-lg hover:bg-[#0265ff] transition-colors"
              >
                Publish Project to Live Portal
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Incoming Inquiries */}
        {tab === "inquiries" && (
          <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#f2f3ff] text-[12px] uppercase font-mono text-[#424656]">
                <tr>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Brief Details</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50">
                    <td className="p-4 font-semibold">
                      {inq.fullName}
                      <span className="block text-[12px] font-normal text-[#424656]">{inq.email}</span>
                    </td>
                    <td className="p-4">
                      {inq.company}
                      {inq.website && (
                        <a href={inq.website} target="_blank" rel="noreferrer" className="block text-[12px] text-[#004fcb]">
                          {inq.website}
                        </a>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-[#ebedfc] text-[#004fcb] font-bold text-[12px]">
                        {inq.budget}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs text-[13px] text-[#424656] truncate">
                      {inq.brief}
                    </td>
                    <td className="p-4 text-[12px] font-mono text-slate-400">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}