import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const EARNINGS = [
  { label: "This Month", value: "₹12,400", sub: "↑ 22% vs last month", color: "#34d399" },
  { label: "Total Earned", value: "₹82,000", sub: "since March 2023", color: "#a855f7" },
  { label: "Pending Payout", value: "₹3,200", sub: "releases in 2 days", color: "#fbbf24" },
];

const RECENT_ACTIVITY = [
  { action: "Task completed", detail: "Fix React performance bug", amount: "+₹2,500", time: "2h ago", type: "credit" },
  { action: "Task accepted",  detail: "Design 3 social banners", amount: "Pending",   time: "1d ago", type: "pending" },
  { action: "Task completed", detail: "Build landing page",      amount: "+₹8,500", time: "3d ago", type: "credit" },
  { action: "Review received", detail: "★★★★★ from Priya K.",    amount: "",         time: "4d ago", type: "review" },
];

export default function Profile({ tasks }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <GlassCard className="text-center p-14 max-w-sm w-full">
          <div className="text-5xl mb-5">🔒</div>
          <h2 className="font-syne font-bold text-xl mb-3">Sign in to view profile</h2>
          <p className="text-white/45 text-sm mb-7">Access your tasks, earnings, and settings</p>
          <button className="btn-primary px-7 py-3 text-sm" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </GlassCard>
      </div>
    );
  }

  const myTasks = tasks.filter((t) => t.userInitials === user.initials).slice(0, 4);

  const handleLogout = () => {
    logout();
    toast("Signed out. See you soon!", "info");
    navigate("/");
  };

  return (
    <div className="relative z-10 flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Profile header */}
        <div
          className="relative overflow-hidden rounded-3xl border border-white/[0.12] p-8 mb-6 animate-fade-up"
          style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
        >
          {/* Glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.14), transparent 70%)" }}
          />

          <div className="flex items-start gap-6 flex-wrap relative z-10">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-syne font-extrabold text-3xl flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#6d28d9,#be185d)",
                border: "2px solid rgba(168,85,247,0.45)",
              }}
            >
              {user.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-syne font-extrabold text-2xl text-white">{user.name}</h1>
              <div className="text-purple-400 text-sm mb-1">{user.handle}</div>
              <div className="text-amber-400 text-sm mb-2">
                {"★".repeat(Math.floor(user.rating || 0))} {user.rating || "New"}{" "}
                {user.reviews > 0 && (
                  <span className="text-white/35 text-xs ml-1">· {user.reviews} reviews</span>
                )}
              </div>
              <p className="text-white/50 text-sm max-w-md">{user.bio}</p>

              {/* Stats */}
              <div className="flex gap-8 mt-5">
                {[
                  { num: user.tasksCompleted, label: "Tasks Done", color: "#a855f7" },
                  { num: `₹${(user.earned || 0).toLocaleString("en-IN")}`, label: "Earned", color: "#ec4899" },
                  { num: `${user.completionRate}%`, label: "Completion", color: "#38bdf8" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-syne font-extrabold text-xl" style={{ color: s.color }}>{s.num}</div>
                    <div className="text-[11px] text-white/35 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button className="btn-ghost px-5 py-2.5 text-[13px]">Edit Profile</button>
              <button
                onClick={() => navigate("/post")}
                className="btn-primary px-5 py-2.5 text-[13px]"
              >
                Post Task
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-[13px] rounded-2xl text-white/40 hover:text-red-400 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Skills */}
          {user.skills?.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/[0.08] relative z-10">
              <div className="form-label mb-3">Skills</div>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-xl text-[12px] font-medium border"
                    style={{
                      background: "rgba(168,85,247,0.12)",
                      borderColor: "rgba(168,85,247,0.28)",
                      color: "#c084fc",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Left: My Tasks + Activity */}
          <div className="flex flex-col gap-5">

            {/* My posted tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-label mb-0">My Posted Tasks</h2>
                <button
                  onClick={() => navigate("/post")}
                  className="btn-primary px-4 py-2 text-[12px]"
                >
                  + New Task
                </button>
              </div>

              {myTasks.length === 0 ? (
                <GlassCard className="text-center py-12 animate-fade-up" hover={false}>
                  <div className="text-3xl mb-3">📋</div>
                  <p className="text-white/45 text-sm mb-4">No tasks posted yet</p>
                  <button className="btn-primary px-6 py-2.5 text-sm" onClick={() => navigate("/post")}>
                    Post Your First Task
                  </button>
                </GlassCard>
              ) : (
                <div className="flex flex-col gap-3">
                  {myTasks.map((t, i) => (
                    <div
                      key={t.id}
                      onClick={() => navigate(`/task/${t.id}`)}
                      className="glass p-4 cursor-pointer animate-fade-up"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`badge ${t.badge}`}>{t.cat}</span>
                            <div className={`urgency-dot ${t.urgency === "hot" ? "urgency-hot" : t.urgency === "med" ? "urgency-med" : "urgency-low"}`} />
                          </div>
                          <p className="text-sm font-medium text-white/85 truncate">{t.title}</p>
                          <p className="text-[11px] text-white/35 mt-1">{t.offers} offers · {t.views} views · {t.timeAgo}</p>
                        </div>
                        <div
                          className="font-syne font-bold text-lg flex-shrink-0"
                          style={{
                            background: "linear-gradient(135deg,#a855f7,#ec4899)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                          }}
                        >
                          ₹{t.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div>
              <h2 className="section-label">Recent Activity</h2>
              <GlassCard className="p-2 animate-fade-up" hover={false}>
                {RECENT_ACTIVITY.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors hover:bg-white/[0.04]"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        background: a.type === "credit" ? "rgba(52,211,153,0.15)"
                          : a.type === "review" ? "rgba(251,191,36,0.15)"
                          : "rgba(168,85,247,0.15)",
                      }}
                    >
                      {a.type === "credit" ? "💰" : a.type === "review" ? "⭐" : "📌"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white/80">{a.action}</div>
                      <div className="text-xs text-white/40 truncate">{a.detail}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {a.amount && (
                        <div
                          className="text-sm font-semibold"
                          style={{ color: a.type === "credit" ? "#34d399" : a.type === "pending" ? "#fbbf24" : "transparent" }}
                        >
                          {a.amount}
                        </div>
                      )}
                      <div className="text-[11px] text-white/30">{a.time}</div>
                    </div>
                  </div>
                ))}
              </GlassCard>
            </div>
          </div>

          {/* Right: Earnings */}
          <div className="flex flex-col gap-4">
            <h2 className="section-label">Earnings</h2>

            {EARNINGS.map((e, i) => (
              <GlassCard
                key={e.label}
                className="p-5 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
                hover={false}
              >
                <div className="text-[11px] uppercase tracking-widest text-white/35 font-semibold mb-1.5">{e.label}</div>
                <div className="font-syne font-extrabold text-3xl mb-1" style={{ color: e.color }}>{e.value}</div>
                <div className="text-[11px] text-white/35">{e.sub}</div>
              </GlassCard>
            ))}

            {/* Withdraw */}
            <button
              className="btn-primary w-full py-3.5 text-[14px] animate-fade-up"
              style={{ animationDelay: "240ms" }}
              onClick={() => toast("Withdrawal initiated! Arrives in 1–2 business days.", "success")}
            >
              Withdraw Earnings →
            </button>

            {/* Joined */}
            <GlassCard className="p-5 animate-fade-up" style={{ animationDelay: "280ms" }} hover={false}>
              <div className="form-label mb-3">Account Info</div>
              {[
                ["Member Since", user.joinedDate || "Recently"],
                ["Email", user.email],
                ["Account Type", "Verified Tasker"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-white/[0.06] last:border-0">
                  <span className="text-[12px] text-white/35">{label}</span>
                  <span className="text-[12px] font-medium text-white/70 truncate max-w-[55%] text-right">{value}</span>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
