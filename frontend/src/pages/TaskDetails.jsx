import { useParams, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const URGENCY_LABEL = { hot: "🔴 Urgent (24h)", med: "🟡 Within a week", low: "🟢 Flexible" };

export default function TaskDetails({ tasks }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const task = tasks.find((t) => t.id === Number(id));

  if (!task) {
    return (
      <div className="relative z-10 flex items-center justify-center h-full">
        <GlassCard className="text-center p-14">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="font-syne font-bold text-xl mb-3 text-slate-800">Task not found</h2>
          <button className="btn-primary px-6 py-3 text-sm" onClick={() => navigate("/")}>
            Back to Explore
          </button>
        </GlassCard>
      </div>
    );
  }

  const handleAccept = () => {
    if (!user) {
      toast("Please sign in to accept tasks", "error");
      navigate("/login");
      return;
    }
    toast("Task accepted! The poster will contact you shortly. 🎉", "success");
    setTimeout(() => navigate("/"), 1600);
  };

  const handleMessage = () => {
    if (!user) { toast("Please sign in to message", "error"); navigate("/login"); return; }
    toast(`Message sent to ${task.userName}!`, "success");
  };

  return (
    <div className="relative z-10 flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="btn-ghost px-4 py-2 text-sm mb-7 flex items-center gap-2"
        >
          ← Back to Explore
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Main */}
          <GlassCard className="p-8 animate-fade-up">
            {/* Status row */}
            <div className="flex items-center gap-3 mb-5">
              <span className={`badge ${task.badge}`}>{task.cat}</span>
              <div className={`urgency-dot ${task.urgency === "hot" ? "urgency-hot" : task.urgency === "med" ? "urgency-med" : "urgency-low"}`} />
              <span className="text-[12px] text-slate-400">{URGENCY_LABEL[task.urgency]}</span>
            </div>

            {/* Price */}
            <div
              className="font-syne font-extrabold leading-none mb-3"
              style={{
                fontSize: 52,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ₹{task.price.toLocaleString("en-IN")}
            </div>

            <h1 className="font-syne font-bold text-2xl text-slate-900 mb-6 leading-snug">
              {task.title}
            </h1>

            <p className="text-slate-500 text-[14px] leading-relaxed mb-8">{task.description}</p>

            {/* Skills */}
            <div className="mb-8">
              <div className="form-label">Required Skills</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {task.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-xl text-[12px] font-medium border"
                    style={{
                      background: "rgba(99,102,241,0.06)",
                      borderColor: "rgba(99,102,241,0.18)",
                      color: "#4f46e5",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              {[
                { value: task.offers, label: "Offers", color: "#6366f1" },
                { value: task.views, label: "Views", color: "#3b82f6" },
                { value: `${task.userRating}★`, label: "Poster Rating", color: "#f59e0b" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-syne font-extrabold text-2xl" style={{ color: s.color }}>
                    {s.value}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">

            {/* Action card */}
            <GlassCard className="p-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <div className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Task Budget</div>
              <div
                className="font-syne font-extrabold text-4xl mb-5"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ₹{task.price.toLocaleString("en-IN")}
              </div>

              <button
                onClick={handleAccept}
                className="w-full py-4 rounded-xl font-syne font-bold text-[15px] text-white border-none cursor-pointer transition-all duration-200 mb-3"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 4px 16px rgba(99,102,241,0.30)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg,#4f46e5,#7c3aed)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.45)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg,#6366f1,#8b5cf6)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.30)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                ⚡ Accept Task
              </button>

              <button
                onClick={handleMessage}
                className="btn-ghost w-full py-3 text-[13px] text-center"
              >
                💬 Message Poster
              </button>
            </GlassCard>

            {/* Task details */}
            <GlassCard className="p-5 animate-fade-up" style={{ animationDelay: "140ms" }}>
              <div className="font-medium text-[13px] mb-4 text-slate-700">Task Details</div>
              {[
                ["Location", task.location],
                ["Category", task.cat],
                ["Posted", task.postedDate],
                ["Urgency", URGENCY_LABEL[task.urgency]],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                  <span className="text-[12px] text-slate-400">{label}</span>
                  <span className="text-[12px] font-medium text-slate-600">{value}</span>
                </div>
              ))}
            </GlassCard>

            {/* Poster info */}
            <GlassCard className="p-5 animate-fade-up" style={{ animationDelay: "180ms" }}>
              <div className="font-medium text-[13px] mb-4 text-slate-700">Posted By</div>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold font-syne flex-shrink-0 text-white"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                >
                  {task.userInitials}
                </div>
                <div>
                  <div className="font-semibold text-[14px] text-slate-800">{task.userName}</div>
                  <div className="text-amber-500 text-[12px]">
                    {"★".repeat(Math.floor(task.userRating))} {task.userRating} · Verified
                  </div>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </div>
    </div>
  );
}