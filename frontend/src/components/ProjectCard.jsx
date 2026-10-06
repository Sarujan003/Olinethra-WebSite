
export default function ProjectCard({ project, onInspect, isAdmin, onDelete }) {
  return (
    <article className="group flex flex-col rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-black/5">
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={project.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono font-bold text-[#a33e00]">
          {project.category?.toUpperCase()}
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-[11px] font-mono text-[#171b26]">
          {project.badge || "PROD-SYS"}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[13px]">
          <span className="font-semibold">{project.client}</span>
          <span className="text-[11px] opacity-80 font-mono">{project.tag}</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#171b26] group-hover:text-[#004fcb] transition-colors">
            {project.title}
          </h2>
          <p className="text-[14px] text-[#424656] mt-2 line-clamp-2">
            {project.summary}
          </p>
        </div>

        {project.challenge && (
          <div className="p-3 rounded-lg bg-[#f2f3ff] text-[13px] text-[#424656]">
            <span className="font-bold text-[#004fcb] flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[15px]">troubleshoot</span>
              The Architecture Challenge
            </span>
            <p className="line-clamp-2">{project.challenge}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-[#ebedfc]">
            <span className="text-[11px] text-[#424656] block">{project.metric1_label || "Metric 1"}</span>
            <span className="text-[16px] font-bold text-[#004fcb]">{project.metric1_val || "N/A"}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#ebedfc]">
            <span className="text-[11px] text-[#424656] block">{project.metric2_label || "Metric 2"}</span>
            <span className="text-[16px] font-bold text-[#fe6a17]">{project.metric2_val || "N/A"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(project.technologies) ? project.technologies : []).map((tech, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-[#ebedfc] text-[11px] font-mono text-[#424656]">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onInspect(project)}
            className="flex-1 py-2 rounded-lg bg-[#0265ff] text-white text-[13px] font-semibold hover:bg-[#004fcb] transition-colors flex items-center justify-center gap-1"
          >
            <span>Inspect Architecture</span>
            <span className="material-symbols-outlined text-[16px]">terminal</span>
          </button>

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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