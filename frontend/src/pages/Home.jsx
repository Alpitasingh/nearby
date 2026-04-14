import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import GlassCard from "../components/GlassCard";
import { CATEGORIES } from "../data/tasks";
import { useAuth } from "../context/AuthContext";

export default function Home({ tasks, setTasks }) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  // 🔥 NEW: radius filter (UI same rahega, sirf logic)
  const [radius, setRadius] = useState(10);

  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔥 FETCH TASKS (FIXED + STABLE + DISTANCE READY)
  useEffect(() => {
    const token = localStorage.getItem("taskly_token");

    if (!token) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        console.log("Fetching tasks at:", lat, lng, "radius:", radius);

        fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks/nearby?latitude=${lat}&longitude=${lng}&radius=${radius}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("API RESPONSE:", data);

            // 🔥 FIX: handle both formats
            const incomingTasks =
              data?.data?.tasks || data?.tasks || [];

            // 🔥 IMPORTANT: NEVER wipe UI
            if (incomingTasks.length > 0) {
              setTasks(incomingTasks);
            } else {
              console.log("No tasks in this radius → keeping old UI");
            }
          })
          .catch((err) => {
            console.log("Fetch error:", err);
          });
      },
      (err) => {
        console.log("Location error:", err);
      }
    );
  }, [setTasks, radius]); // 🔥 refetch when radius changes

  // ✅ SAFE TASKS
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // ✅ FILTER (NO CHANGE)
  const filtered = useMemo(() => {
    return safeTasks.filter((t) => {
      const matchCat = activeCat === "All" || t.category === activeCat;

      const matchQ =
        !query ||
        t.title?.toLowerCase().includes(query.toLowerCase()) ||
        t.category?.toLowerCase().includes(query.toLowerCase());

      return matchCat && matchQ;
    });
  }, [safeTasks, query, activeCat]);

  // ✅ STATS (UI SAME)
  const STATS = [
    {
      label: "Active Tasks",
      value: safeTasks.length,
      sub: "live near you",
      color: "#6366f1",
    },
    {
      label: "Taskers Online",
      value: safeTasks.length,
      sub: "nearby",
      color: "#8b5cf6",
    },
    {
      label: "Avg. Response",
      value: safeTasks.length ? "Live" : "--",
      sub: "real-time",
      color: "#3b82f6",
    },
  ];

  return (
    <div className="relative z-10 flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 pb-16">

        {/* Hero */}
        <div className="text-center py-14 pb-10">

          {/* 🔥 NEW: radius buttons (UI SAME STYLE) */}
          <div className="flex justify-center gap-2 mb-4">
            {[2, 5, 10].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`px-4 py-1.5 rounded-full text-[12px] border ${
                  radius === r ? "bg-purple-500 text-white" : ""
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium mb-5"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
              color: "#6366f1",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {safeTasks.length} tasks active near you
          </div>

          <h1 className="font-syne font-extrabold text-5xl leading-tight mb-4 text-slate-900">
            Task & Earn
          </h1>

          <p className="text-slate-500 text-[15px] max-w-lg mx-auto mb-9">
            From coding to delivery, connect with verified taskers in your neighbourhood instantly.
          </p>

          {/* SEARCH */}
          <div className="flex gap-2 max-w-xl mx-auto p-2 rounded-2xl">
            <input
              className="flex-1 bg-white/70 backdrop-blur-lg border border-white/30 outline-none text-black placeholder:text-gray-500 text-[14px] px-4 py-2 rounded-xl shadow-sm"
              placeholder="Search tasks near you..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              className="btn-primary px-5 py-2.5 text-[13px]"
              onClick={() => navigate("/post")}
            >
              Post Task
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap justify-center mb-9">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="px-4 py-1.5 rounded-full text-[12px] border"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {STATS.map((s) => (
            <GlassCard key={s.label} className="px-6 py-5">
              <div className="text-xs text-gray-400">{s.label}</div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </GlassCard>
          ))}
        </div>

        {/* Tasks */}
        <div>
          <h2 className="mb-4 font-bold">
            {activeCat === "All" ? "🔥 Trending Near You" : activeCat}
          </h2>

          {filtered.length === 0 ? (
            <GlassCard className="text-center py-10">
              No tasks found in {radius} km 😕
            </GlassCard>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((task, i) => (
                <TaskCard key={task._id || i} task={task} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}