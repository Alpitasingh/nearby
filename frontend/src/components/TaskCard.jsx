import { useNavigate } from "react-router-dom";

const URGENCY_CONFIG = {
  hot: { dotClass: "urgency-hot", label: "Urgent" },
  med: { dotClass: "urgency-med", label: "Soon" },
  low: { dotClass: "urgency-low", label: "Flexible" },
};

export default function TaskCard({ task, style = {} }) {
  const navigate = useNavigate();
  const urg = URGENCY_CONFIG[task.urgency] || URGENCY_CONFIG.low;

  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className="relative overflow-hidden cursor-pointer p-5 rounded-2xl border transition-all duration-250 group animate-fade-up"
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderColor: "rgba(255,255,255,0.80)",
        boxShadow: "0 2px 12px rgba(99,102,241,0.05), 0 1px 3px rgba(0,0,0,0.04)",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.90)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.22)";
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.65)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.80)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,102,241,0.05), 0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      {/* Subtle top highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-80 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)" }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <span className={`badge ${task.badge}`}>{task.cat}</span>
        <span
          className="font-syne font-extrabold text-lg"
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ₹{task.price.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-medium text-[14px] text-slate-700 leading-snug mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 flex-wrap">
        <span> {task.dist}</span>
        <div className="w-[3px] h-[3px] rounded-full bg-slate-300" />
        <span> {task.timeAgo}</span>
        <div className="w-[3px] h-[3px] rounded-full bg-slate-300" />
        <span> {task.offers} offers</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold font-syne text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            {task.userInitials}
          </div>
          <span className="text-[11px] text-slate-400">{task.userName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`urgency-dot ${urg.dotClass}`} />
          <span className="text-[11px] text-slate-400">{urg.label}</span>
        </div>
      </div>
    </div>
  );
}