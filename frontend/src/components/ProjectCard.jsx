
import { Link } from "react-router-dom";

export default function ProjectCard({ project, onInspect, isAdmin, onDelete }) {
  // Determine badge colors based on badge text
  const badgeText = (project.badge || project.category || "PROD-SYS").toUpperCase();
  let badgeStyle = "bg-[#171b26] text-white";
  if (badgeText.includes("FINTECH") || badgeText.includes("HFT")) {
    badgeStyle = "bg-[#171b26] text-white";
  } else if (badgeText.includes("HEALTH") || badgeText.includes("AI")) {
    badgeStyle = "bg-[#006178] text-white";
  } else if (badgeText.includes("SUPPLY") || badgeText.includes("ML") || badgeText.includes("CHAIN")) {
    badgeStyle = "bg-[#e55300] text-white";
  }

  const briefUrl = `/projects/brief/${project.id}`;

  return (
    <article className="group flex flex-col rounded-2xl bg-white shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden border border-black/5">
      {/* Top Image Visualizer */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={project.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Top Left Badge Overlay */}
        <div className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs ${badgeStyle}`}>
          {badgeText}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <div className="space-y-2.5">
          <h3 className="text-2xl font-extrabold text-[#171b26] tracking-tight group-hover:text-[#004fcb] transition-colors">
            {project.title}
          </h3>
          <p className="text-[14px] text-[#424656] leading-relaxed font-normal line-clamp-3">
            {project.summary}
          </p>
        </div>

        {/* Metric Grid Box */}
        <div className="bg-[#f2f3ff] rounded-xl p-4 grid grid-cols-2 gap-4 border border-black/5">
          <div>
            <span className="text-[12px] font-medium text-slate-500 block mb-0.5">
              {project.metric1_label || "Metric 1"}
            </span>
            <span className="text-[18px] md:text-[20px] font-extrabold text-[#004fcb]">
              {project.metric1_val || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-[12px] font-medium text-slate-500 block mb-0.5">
              {project.metric2_label || "Metric 2"}
            </span>
            <span className="text-[18px] md:text-[20px] font-extrabold text-[#fe6a17]">
              {project.metric2_val || "N/A"}
            </span>
          </div>
        </div>

        {/* Technologies Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(project.technologies) ? project.technologies : []).map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md bg-[#ebedfc] text-[12px] font-mono font-medium text-[#171b26]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Bottom Link Action */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <Link
            to={briefUrl}
            className="text-[#004fcb] hover:text-[#0265ff] font-bold text-[14px] flex items-center gap-1.5 transition-all cursor-pointer group/link"
          >
            <span>Inspect Architecture Brief</span>
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover/link:translate-x-1">
              arrow_forward
            </span>
          </Link>

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
              title="Delete Project"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}