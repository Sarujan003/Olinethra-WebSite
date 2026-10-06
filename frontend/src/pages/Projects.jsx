import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedModal, setSelectedModal] = useState(null);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (data.success) setProjects(data.data);
      })
      .catch(err => console.error(err));
  }, []);

  const filtered = projects.filter(p => {
    const matchCategory = activeCategory === "all" || p.category?.toLowerCase() === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.summary?.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase())));
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-[12px] font-mono text-[#004fcb] uppercase font-bold">GET /api/v1/projects</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Case Studies &amp; Production Systems</h1>
          <p className="text-[16px] text-[#424656] max-w-2xl">
            Explore verified software architecture and digital transformations delivered by Olinethra.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-xl bg-[#ebedfc] mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {["all", "fintech", "ai", "cloud", "health", "saas"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold capitalize transition-all ${
                  activeCategory === cat ? "bg-[#004fcb] text-white" : "bg-white text-[#424656]"
                }`}
              >
                {cat === "all" ? `All (${projects.length})` : cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search stack, client, or architecture..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-lg bg-white text-[14px] outline-none"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onInspect={p => setSelectedModal(p)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#424656]">
            <p className="text-lg font-semibold">No systems match your filter.</p>
          </div>
        )}

        {/* Inspection Modal */}
        {selectedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <h3 className="text-xl font-bold">{selectedModal.title}</h3>
                <button
                  onClick={() => setSelectedModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4 text-[14px]">
                <div className="p-3 rounded-lg bg-[#f2f3ff]">
                  <strong className="text-red-600 block mb-1">Architectural Challenge:</strong>
                  <p className="text-[#424656]">{selectedModal.challenge}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#f2f3ff]">
                  <strong className="text-[#004fcb] block mb-1">Olinethra Implementation:</strong>
                  <p className="text-[#424656]">{selectedModal.summary}</p>
                </div>

                <div>
                  <strong className="block mb-1">Raw Production Manifest:</strong>
                  <pre className="p-4 rounded-xl bg-[#171b26] text-[#b3c5ff] font-mono text-[12px] overflow-x-auto">
                    {JSON.stringify(selectedModal, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}