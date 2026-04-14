import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH REAL TASKS
  useEffect(() => {
    const token = localStorage.getItem("taskly_token");

    fetch("http://localhost:5000/api/tasks/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMyTasks(data.tasks || []);
      })
      .catch(() => setMyTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    toast("Signed out. See you soon!", "info");
    navigate("/");
  };

  // ✅ REAL CALCULATIONS
  const totalEarnings = myTasks.reduce((sum, t) => sum + (t.price || 0), 0);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <GlassCard className="p-10 text-center">
          <p>Please login</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* 🔥 HEADER (UI SAME) */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.12] p-8 mb-6"
          style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>

          <div className="flex items-start gap-6 flex-wrap">

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl"
              style={{
                background: "linear-gradient(135deg,#6d28d9,#be185d)",
              }}>
              {user.name?.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>

              {/* Stats */}
              <div className="flex gap-8 mt-5">
                <div>
                  <div className="text-xl font-bold text-purple-400">
                    {myTasks.length}
                  </div>
                  <div className="text-xs text-gray-400">Tasks</div>
                </div>

                <div>
                  <div className="text-xl font-bold text-pink-400">
                    ₹{totalEarnings}
                  </div>
                  <div className="text-xs text-gray-400">Earned</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/post")}
                className="btn-primary px-5 py-2 text-sm"
              >
                Post Task
              </button>

              <button
                onClick={handleLogout}
                className="text-red-400 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 MY TASKS (REAL DATA) */}
        <div className="mb-6">
          <h2 className="section-label">My Tasks</h2>

          {loading ? (
            <p>Loading...</p>
          ) : myTasks.length === 0 ? (
            <GlassCard className="text-center py-10">
              <p>No tasks yet</p>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-3">
              {myTasks.map((t) => (
                <div key={t._id} className="glass p-4">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-gray-400">₹{t.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 EARNINGS (REAL) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <GlassCard className="p-5">
            <p className="text-xs text-gray-400">Total Earned</p>
            <h2 className="text-xl font-bold text-green-400">
              ₹{totalEarnings}
            </h2>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-xs text-gray-400">Tasks Completed</p>
            <h2 className="text-xl font-bold text-purple-400">
              {myTasks.length}
            </h2>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-xs text-gray-400">Status</p>
            <h2 className="text-xl font-bold text-blue-400">
              Active
            </h2>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}