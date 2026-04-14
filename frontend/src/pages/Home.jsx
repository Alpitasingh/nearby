import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import GlassCard from "../components/GlassCard";
import { TASKS, CATEGORIES } from "../data/tasks";
import { useAuth } from "../context/AuthContext";

const STATS = [
  { label: "Active Tasks", value: "1,284", sub: "↑ 12% this week", color: "#6366f1" },
  { label: "Taskers Online", value: "348", sub: "within 5 km", color: "#8b5cf6" },
  { label: "Avg. Response", value: "4 min", sub: "fastest in city", color: "#3b82f6" },
];

export default function Home({ tasks, setTasks }) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const { user } = useAuth();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchCat = activeCat === "All" || t.cat === activeCat;
      const matchQ =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.cat.toLowerCase().includes(query.toLowerCase()) ||
        t.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchQ;
    });
  }, [tasks, query, activeCat]);

  return (
    <div className="relative z-10 flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 pb-16">

        {/* Hero */}
        <div className="text-center py-14 pb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium mb-5"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
              color: "#6366f1",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            348 taskers active near you
          </div>
          <h1 className="font-syne font-extrabold text-5xl leading-tight mb-4 text-slate-900">
            Task & Earn{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              
            </span>
          </h1>
          <p className="text-slate-500 text-[15px] max-w-lg mx-auto mb-9">
            From coding to delivery, connect with verified taskers in your neighbourhood instantly.
          </p>

          {/* Search */}
          <div
            className="flex gap-2 max-w-xl mx-auto p-2 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(99,102,241,0.15)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.08)",
            }}
          >
            <input
              className="flex-1 bg-transparent outline-none text-slate-700 text-[14px] px-3 placeholder:text-slate-400"
              placeholder="Search tasks near you..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="btn-primary px-5 py-2.5 text-[13px] rounded-xl"
              onClick={() => navigate("/post")}
            >
              Post Task
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap justify-center mb-9">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200"
              style={{
                background: activeCat === cat ? "rgba(99,102,241,0.10)" : "rgba(255,255,255,0.65)",
                borderColor: activeCat === cat ? "rgba(99,102,241,0.40)" : "rgba(99,102,241,0.12)",
                color: activeCat === cat ? "#6366f1" : "#64748b",
                backdropFilter: "blur(8px)",
                boxShadow: activeCat === cat ? "0 2px 8px rgba(99,102,241,0.12)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {STATS.map((s) => (
            <GlassCard key={s.label} className="px-6 py-5" hover={false}>
              <div className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5">
                {s.label}
              </div>
              <div className="font-syne font-extrabold text-3xl" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{s.sub}</div>
            </GlassCard>
          ))}
        </div>

        {/* Task grid */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-label mb-0">
              {activeCat === "All" ? "🔥 Trending Near You" : `📂 ${activeCat} Tasks`}
            </h2>
            <span className="text-[13px] text-slate-400">{filtered.length} tasks found</span>
          </div>

          {filtered.length === 0 ? (
            <GlassCard className="text-center py-16" hover={false}>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-syne font-bold text-lg mb-2 text-slate-700">No tasks found</h3>
              <p className="text-slate-400 text-sm mb-6">
                Try a different search or be the first to post in this category!
              </p>
              <button className="btn-primary px-6 py-3 text-sm" onClick={() => navigate("/post")}>
                Post the First Task
              </button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}